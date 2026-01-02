package com.example.backend.handler;

import com.example.backend.common.util.JWTUtil;
import com.example.backend.service.jwt.JwtService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.util.StringUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@RequiredArgsConstructor
public class RefreshTokenLogoutHandler implements LogoutHandler {

    private final JwtService jwtService;

    /**
     * 로그아웃 RefreshToken 삭제 핸들러
     * request.getInputStream()으로 바이트 스트림을 가져와서, BufferedReader로 한 줄씩 읽고, reduce로 합쳐서 하나의 문자열로 만듦
     * ObjectMapper를 사용해서 문자열(JSON)을 파싱
     * JsonNode로 JSON 객체를 얻고, "refreshToken" 키가 존재하면 값을 추출실행
     */
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        try {
            String body = new BufferedReader(new InputStreamReader(request.getInputStream()))
                    .lines().reduce("", String::concat);

            if (!StringUtils.hasText(body)) return;

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(body); // 트리구조로 파싱
            String refreshToken = jsonNode.has("refreshToken") ? jsonNode.get("refreshToken").asText() : null;

            // 유효성 검증
            if (refreshToken == null) {
                return;
            }

            Boolean isValid = JWTUtil.isValid(refreshToken, false);
            if (!isValid) {
                return;
            }

            // RefreshToken 삭제
            jwtService.deleteRefreshToken(refreshToken);

            // 브라우저 쿠키 삭제
            ResponseCookie deleteRefreshCookie = ResponseCookie
                    .from("refreshToken", "")
                    .httpOnly(true)
                    // .secure(true)   // https 환경이면 주석 해제
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(0)
                    .build();

            response.addHeader("Set-Cookie", deleteRefreshCookie.toString());

            ResponseCookie deleteAccessToken = ResponseCookie
                    .from("accessToken", "")
                    .httpOnly(false)
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(0)
                    .build();
            response.addHeader("Set-Cookie", deleteAccessToken.toString());

        } catch (IOException e) {
            throw new RuntimeException("리프레시 토큰을 읽는 과정에서 실패 했습니다" + e);
        }


    }

}

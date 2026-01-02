package com.example.backend.handler;

import com.example.backend.service.jwt.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;


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
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return;

        for (Cookie cookie : cookies) {
            if ("refreshToken".equals(cookie.getName())) {
                String refreshToken = cookie.getValue();

                jwtService.deleteRefreshToken(refreshToken);

                ResponseCookie delete = ResponseCookie.from("refreshToken", "")
                        .httpOnly(true)
                        .path("/")
                        .maxAge(0)
                        .build();

                response.addHeader("Set-Cookie", delete.toString());

            }
        }
    }
}

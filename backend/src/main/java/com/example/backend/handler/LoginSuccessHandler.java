package com.example.backend.handler;

import com.example.backend.common.util.JWTUtil;
import com.example.backend.service.jwt.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@Qualifier("LoginSuccessHandler")
@RequiredArgsConstructor
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        // 유저 정보 추출
        String username = authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        // JWT AccessToken / RefreshToken 발급
        String accessToken = JWTUtil.createJWT(username, role, true);
        String refreshToken = JWTUtil.createJWT(username, role, false);

        // 발급한 RefreshToken DB 에 저장
        jwtService.addRefreshToken(username, refreshToken);

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax") // 또는 Lax
                .path("/")
                .maxAge(24 * 60 * 60)
                .build();
        // 브라우저로 바로 RefreshToken 쿠키로 저장
        response.addHeader("Set-Cookie", refreshCookie.toString());

        // 응답
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);

        // Map에 AccessToken 만 담고 나서 ObjectMapper로 JSON 문자열로 변환
        Map<String, String> tokenMap = new HashMap<>();
        tokenMap.put("accessToken", accessToken);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(tokenMap);

        // js 로 AccessToken json 형태로 반환
        response.getWriter().write(json);
        response.getWriter().flush();
    }


}

package com.example.backend.handler;

import com.example.backend.common.util.JWTUtil;
import com.example.backend.service.jwt.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Qualifier("SocialSuccessHandler")
public class SocialSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        // 1. 사용자 정보
        String username = authentication.getName();
        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority(); // ROLE_USER 그대로 사용

        // 2. JWT 발급
        String accessToken = JWTUtil.createJWT(username, "ROLE_" + role, true);
        String refreshToken = JWTUtil.createJWT(username, "ROLE_" + role, false);

        // 3. RefreshToken DB 저장
        jwtService.addRefreshToken(username, refreshToken);

        // 4. RefreshToken 쿠키 (HttpOnly)
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(24 * 60 * 60)
                .build();
        response.addHeader("Set-Cookie", refreshCookie.toString());


        // 5. accessToken은 URL로 전달 (redirect)
        response.sendRedirect(
                "http://localhost:3000/oauth-success");

    }

}


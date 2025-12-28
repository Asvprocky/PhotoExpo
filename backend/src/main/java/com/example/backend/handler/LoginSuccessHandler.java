package com.example.backend.handler;

import com.example.backend.common.util.JWTUtil;
import com.example.backend.service.jwt.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
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

        // user , role
        String username = authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        // JWT AccessToken / RefreshToken 발급
        String accessToken = JWTUtil.createJWT(username, role, true);
        String refreshToken = JWTUtil.createJWT(username, role, false);

        // 발급한 RefreshToken DB 에 저장
        jwtService.addRefreshToken(username, refreshToken);

        // AccessToken 쿠키 생성 (브라우저 자동 저장용)
        Cookie accessCookie = new Cookie("accessToken", accessToken);
        accessCookie.setPath("/");      // 모든 경로에서 접근 가능
        accessCookie.setHttpOnly(true); // [보안] 자바스크립트로 접근 불가능 (XSS 방지)
        accessCookie.setMaxAge(60 * 60); // 1시간 (JWT 유효시간과 동일하게 설정)
        // accessCookie.setSecure(true); // https 적용 시 주석 해제

        response.addCookie(accessCookie);
        // 응답
        response.setContentType("application/json;charset=UTF-8");

        // Map에 담고 나서 ObjectMapper로 JSON 문자열로 변환
        Map<String, String> tokenMap = new HashMap<>();
        tokenMap.put("accessToken", accessToken);
        tokenMap.put("refreshToken", refreshToken);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(tokenMap);

        //String json = String.format("{\"accessToken\":\"%s\", \"refreshToken\":\"%s\"}", accessToken, refreshToken);
        response.getWriter().write(json);
        response.getWriter().flush();
    }


}

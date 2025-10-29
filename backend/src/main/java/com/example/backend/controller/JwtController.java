package com.example.backend.controller;

import com.example.backend.dto.JWTRequestDTO;
import com.example.backend.dto.JWTResponseDTO;
import com.example.backend.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class JwtController {

    private final JwtService jwtService;

    /**
     * 소셜 로그인 쿠키 방식의 Refresh 토큰 헤더 방식으로 교환
     */
    @PostMapping(value = "/jwt/exchange", consumes = MediaType.APPLICATION_JSON_VALUE)
    public JWTResponseDTO jwtExchangeApi(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        return jwtService.cookieToHeader(request, response);
    }

    /**
     * Refresh 토큰으로 Access 토큰 재발급 (Rotate 포함)
     */
    @PostMapping(value = "/jwt/refresh", consumes = MediaType.APPLICATION_JSON_VALUE)
    public JWTResponseDTO jwtRefreshApi(
            @Validated @RequestBody JWTRequestDTO dto
    ) {
        return jwtService.refreshRotate(dto);
    }
}

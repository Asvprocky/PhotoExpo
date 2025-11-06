package com.example.backend.controller.jwt;

import com.example.backend.dto.request.JWTRequestDTO;
import com.example.backend.dto.response.JWTResponseDTO;
import com.example.backend.service.jwt.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/jwt")
public class JwtController {

    private final JwtService jwtService;

    /**
     * 소셜 로그인 쿠키 방식의 Refresh 토큰 헤더 방식으로 교환
     */
    @PostMapping(value = "/exchange", consumes = MediaType.APPLICATION_JSON_VALUE)
    public JWTResponseDTO jwtExchangeApi(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        return jwtService.cookieToHeader(request, response);
    }


    /**
     * Refresh 토큰으로 Access 토큰 재발급 (Rotate 포함)
     */
    @PostMapping(value = "/refresh", consumes = MediaType.APPLICATION_JSON_VALUE)
    public JWTResponseDTO jwtRefreshApi(
            @Validated @RequestBody JWTRequestDTO dto
    ) {
        return jwtService.refreshRotate(dto);
    }
}

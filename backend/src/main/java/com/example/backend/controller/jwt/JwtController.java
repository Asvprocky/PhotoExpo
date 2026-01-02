package com.example.backend.controller.jwt;

import com.example.backend.dto.response.JWTResponseDTO;
import com.example.backend.service.jwt.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/jwt")
public class JwtController {

    private final JwtService jwtService;

    /**
     * refreshToken (HttpOnly Cookie) 기반
     * accessToken 재발급 API
     */
    @PostMapping("/refresh")
    public ResponseEntity<JWTResponseDTO> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        JWTResponseDTO refresh = jwtService.refresh(request, response);
        return ResponseEntity.status(200).body(refresh);
    }
}

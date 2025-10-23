package com.example.backend.service;

import com.example.backend.domain.JwtRefresh;
import com.example.backend.repository.JwtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtRepository jwtRepository;

    /**
     * Jwt Refresh Token 발급후 저장
     * 파라미터로 받는 username 은 Users entity 의 유니크 키인 email 값이 인자로 들어가 있음
     */
    @Transactional
    public void addRefreshToken(String username, String refreshToken) {

        JwtRefresh JwtRefreshEntity = JwtRefresh.builder()
                .email(username) // username 에 email 값 들어감
                .refresh(refreshToken)
                .build();

        jwtRepository.save(JwtRefreshEntity);
    }

    /**
     * Jwt Refresh Token 존재 검증
     */
    @Transactional(readOnly = true)
    public Boolean existRefreshToken(String refreshToken) {

        return jwtRepository.existsByRefresh(refreshToken);
    }


    /**
     * Jwt Refresh Token 삭제
     * JwtRepository 에 Transactional 선언하였기 때문에 따로 선언하지 않음
     */
    public void deleteRefreshToken(String refreshToken) {
        jwtRepository.deleteByRefresh(refreshToken);
    }

    /**
     * 유저 탈퇴시 Jwt Refresh Token 삭제
     */
    public void deleteRefreshTokenByEmail(String email) {
        jwtRepository.deleteByEmail(email);

    }

}

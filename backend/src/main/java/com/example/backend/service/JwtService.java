package com.example.backend.service;

import com.example.backend.common.util.JWTUtil;
import com.example.backend.domain.JwtRefresh;
import com.example.backend.dto.JWTRequestDTO;
import com.example.backend.dto.JWTResponseDTO;
import com.example.backend.repository.JwtRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtRepository jwtRepository;

    /**
     * 소셜 로그인 성공 후 쿠키(Refresh) -> 헤더 방식으로 응답
     * 소셜 로그인 후 브라우저 쿠키에 저장된 RefreshToken을 읽어서,
     * 새로운 AccessToken과 RefreshToken을 발급하고 기존 쿠키를 삭제 후, 새 토큰을 DTO로 반환
     */
    @Transactional
    public JWTResponseDTO cookieToHeader(HttpServletRequest request, HttpServletResponse response) {

        // 쿠키 리스트
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            throw new RuntimeException("쿠키가 존재하지 않습니다");
        }

        // RefreshToken 획득
        String refreshToken = null; // 초기화
        for (Cookie cookie : cookies) {   // 쿠키 배열을 순회하면서 이름이 "refreshToken" 인 쿠키를 찾음
            if ("refreshToken".equals(cookie.getName())) {
                refreshToken = cookie.getValue();
                break;
            }
        }

        if (refreshToken == null) {
            throw new RuntimeException("RefreshToken 이 존재하지 않습니다");
        }

        // 기존 RefreshToken 검증
        Boolean isValid = JWTUtil.isValid(refreshToken, false);
        if (!isValid) {
            throw new RuntimeException("유효하지 않은 refreshToken 입니다");
        }

        // 정보 추출
        String username = JWTUtil.getUsername(refreshToken);
        String role = JWTUtil.getRole(refreshToken);

        // 새로운 토큰 생성
        String newAccessToken = JWTUtil.createJWT(username, role, true);
        String newRefreshToken = JWTUtil.createJWT(username, role, false);

        // 기존 Refresh 토큰 DB 삭제 후 신규 추가
        JwtRefresh newJwtRefreshEntity = JwtRefresh.builder()
                .email(username)
                .refresh(newRefreshToken)
                .build();
        deleteRefreshToken(refreshToken); // 가지고있던 검증 완료 된 refreshToken 삭제
        jwtRepository.flush(); // 같은 트랜잭션 내부라 : 삭제 -> 생성 문제 해결 (쿠키 기반 메서드는 flush 필요)
        jwtRepository.save(newJwtRefreshEntity); // 새로운 newRefreshToken 저장

        // 기존 쿠키 제거
        Cookie refreshCookie = new Cookie("refreshToken", null); // 기존 쿠키를 초기화 하고
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(5); // 만료 시간을 5초로 짧게 설정해서 브라우저에서 삭제 되도함.
        response.addCookie(refreshCookie);

        return new JWTResponseDTO(newAccessToken, newRefreshToken);
    }

    /**
     * Refresh 토큰으로 Access 토큰 재발급 로직 (Rotate 포함)
     * 클라이언트가 보내온 RefreshToken으로 AccessToken과 RefreshToken 재발급
     * 헤더 기반 JWT 갱신 로직.
     * 쿠키로 다루지 않고, DTO로 RefreshToken을 받음.
     */
    @Transactional
    public JWTResponseDTO refreshRotate(JWTRequestDTO dto) {
        String refreshToken = dto.getRefreshToken();

        // Refresh 토큰 검증
        Boolean isValid = JWTUtil.isValid(refreshToken, false);
        if (!isValid) {
            throw new RuntimeException("유효하지 않은 refreshToken입니다.");
        }

        // RefreshEntity 존재 확인 (화이트리스트)
        if (!existRefreshToken(refreshToken)) {
            throw new RuntimeException("유효하지 않은 refreshToken입니다.");
        }

        // 정보 추출
        String username = JWTUtil.getUsername(refreshToken);
        String role = JWTUtil.getRole(refreshToken);

        // 토큰 생성
        String newAccessToken = JWTUtil.createJWT(username, role, true);
        String newRefreshToken = JWTUtil.createJWT(username, role, false);

        // 기존 Refresh 토큰 DB 삭제 후 신규 추가
        JwtRefresh newJwtRefreshToken = JwtRefresh.builder()
                .email(username)
                .refresh(newRefreshToken)
                .build();

        deleteRefreshToken(refreshToken); // DTO 기반 메서드는 flush 필요 없음.
        jwtRepository.save(newJwtRefreshToken);

        return new JWTResponseDTO(newAccessToken, newRefreshToken);
    }

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

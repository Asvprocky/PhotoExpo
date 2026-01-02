package com.example.backend.service.jwt;

import com.example.backend.common.util.JWTUtil;
import com.example.backend.domain.JwtRefresh;
import com.example.backend.dto.response.JWTResponseDTO;
import com.example.backend.repository.JwtRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtRepository jwtRepository;

    /**
     * refreshToken 쿠키 기반 accessToken 재발급
     */
    @Transactional
    public JWTResponseDTO refresh(HttpServletRequest request, HttpServletResponse response) {

        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "RefreshToken 쿠키 없음"
            );
        }

        String refreshToken = null;
        for (Cookie cookie : cookies) {
            if ("refreshToken".equals(cookie.getName())) {
                refreshToken = cookie.getValue();
                break;
            }
        }

        if (refreshToken == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "refreshToken 없음");
        }

        //  토큰 유효성
        if (!JWTUtil.isValid(refreshToken, false)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "refreshToken 만료");
        }

        //  DB 화이트리스트 확인
        if (!existRefreshToken(refreshToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "refreshToken 위조");
        }


        String username = JWTUtil.getUsername(refreshToken);
        String role = JWTUtil.getRole(refreshToken);

        String newAccessToken = JWTUtil.createJWT(username, role, true);
        String newRefreshToken = JWTUtil.createJWT(username, role, false);

        deleteRefreshToken(refreshToken);
        addRefreshToken(username, newRefreshToken);

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", newRefreshToken)
                .httpOnly(true)
                .path("/")
                .sameSite("Lax")
                .maxAge(7 * 24 * 60 * 60)
                .build();

        response.addHeader("Set-Cookie", refreshCookie.toString());

        return new JWTResponseDTO(newAccessToken, null);
    }




    /* ===== refreshToken 관리 ===== */

    /**
     * refreshToken에서 username만 추출
     * (서명/만료 검증 없이 claims만 파싱)
     */
    public String getUsernameFromRefreshToken(String refreshToken) {
        return JWTUtil.getUsername(refreshToken);
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

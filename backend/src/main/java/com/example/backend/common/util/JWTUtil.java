package com.example.backend.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

public class JWTUtil {

    private static final SecretKey secretKey;
    private static final Long accessTokenExpire;
    private static final Long refreshTokenExpire;

    static {
        String secretKeyString = "qweasdfdqwrqgfdsawefvdkfkewkerkr";
        secretKey = new SecretKeySpec(secretKeyString.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());

        accessTokenExpire = 3600L * 1000; // 1시간
        refreshTokenExpire = 604800L * 1000; // 7일

    }

    /**
     * JWT 클레임 username 파싱
     */
    public static String getUsername(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("sub", String.class);
    }

    /**
     * JWT 클레임 role 파싱
     */
    public static String getRole(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }


    /**
     * JWT 유효 여부 (위조, 시간, Access/Refresh 여부)
     * True 일시 Access False 일시 Refresh
     */
    public static Boolean isValid(String token, Boolean isAccess) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String type = claims.get("type", String.class);
            if (type == null) return false;

            if (isAccess && !type.equals("access")) return false;
            if (!isAccess && !type.equals("refresh")) return false;

            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * JWT 토큰 생성(access, refresh)
     * Boolean isAccess 가 true 일시 accessToken 생성 false 일시 refreshToken 생성
     */
    public static String createJWT(String username, String role, Boolean isAccess) {
        long now = System.currentTimeMillis();
        long expire = isAccess ? accessTokenExpire : refreshTokenExpire;
        String type = isAccess ? "access" : "refresh";

        return Jwts.builder()
                .claim("sub", username)
                .claim("role", role)
                .claim("type", type)
                .issuedAt(new Date(now))
                .expiration(new Date(now + expire))
                .signWith(secretKey)
                .compact();
    }


}

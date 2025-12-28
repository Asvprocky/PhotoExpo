package com.example.backend.filter;

import com.example.backend.common.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Slf4j

public class JWTFilter extends OncePerRequestFilter {

    // 변경점 AntPathMather 인스턴스 사용
    private final AntPathMatcher pathMatcher;

    public JWTFilter() {
        this.pathMatcher = new AntPathMatcher();
    }


    // 핵심 수정: permitAll 경로일 경우 이 필터 실행을 건너뛰게 함
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String requestUri = request.getRequestURI();
        String method = request.getMethod();

        log.warn("요청 URI: {} (Method: {})", requestUri, method);

        // 1단계: 인증이 필요한 예외 경로를 먼저 검사합니다.
        // 이 경로는 JWTFilter를 실행(false)하여 토큰 검사를 받도록 합니다.
        if (method.equals("GET") && pathMatcher.match("/photo/my", requestUri) ||
                pathMatcher.match("/exhibition/my", requestUri)
        ) {
            log.warn("❌ PROCEED: /photo/my requires authentication.");
            return false;
        }
        // 1. GET 요청이면서, /photo/* 또는 /exhibition/* 와일드카드 패턴에 해당하는 경우
        if (method.equals("GET")) {
            // **GET으로만 공개된 경로**
            if (pathMatcher.match("/exhibition/*", requestUri) ||
                    pathMatcher.match("/photo/*", requestUri) ||
                    pathMatcher.match("/login/**", requestUri) ||
                    pathMatcher.match("/exhibition/all", requestUri)) {
                log.warn("✅ Public Match Success! Filter SKIP.");
                return true;
            }
        }

        // 2. POST 요청이면서, 로그인/토큰 갱신 관련 경로에 해당하는 경우
        if (method.equals("POST")) {
            // **POST로 공개된 경로**
            if (pathMatcher.match("/user", requestUri) ||
                    pathMatcher.match("/user/join", requestUri) ||
                    pathMatcher.match("/user/exist", requestUri)) {
                return true;
            }
        }

        // 3. JWT 갱신 경로는 모든 메서드 허용일 수 있음
        if (pathMatcher.match("/jwt/*", requestUri)) {
            return true;
        }

        // 그 외 (인증 필요한 POST / PUT / DELETE)는 필터 실행
        log.warn("❌ Public Match Failed! Filter PROCEED.");
        return false;

    }


    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws IOException, ServletException {


        String authorization = request.getHeader("Authorization");
        if (authorization == null) {

            filterChain.doFilter(request, response); // 다음 필터로 넘겨줌
            return;
        }

        if (!authorization.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\":\"인증되지 않은 토큰\"}");
            return;
        }

        // 토큰 파싱
        String accessToken = authorization.split(" ")[1]; // 공백기준으로 나누고 [1] 번째 순수 토큰만 담아줌

        if (JWTUtil.isValid(accessToken, true)) {

            String username = JWTUtil.getUsername(accessToken);
            String role = JWTUtil.getRole(accessToken);

            List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(role)); // role 값을 스프링 시큐리티가 이해할 수 있는 형태로 변환
            Authentication auth = new UsernamePasswordAuthenticationToken(username, null, authorities); // 인증된 사용자 정보를 담는 시큐리티의 표준 인터페이스
            SecurityContextHolder.getContext().setAuthentication(auth); // 현재 요청 스레드의 SecurityContext 안에 auth를 저장

            filterChain.doFilter(request, response); // SecurityContext에 인증 정보가 들어있기 때문에, 스프링 시큐리티가 인증된 사용자로 인식함
        } else {

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\":\"인증되지 않은 토큰\"}");

        }
    }
}

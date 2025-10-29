package com.example.backend.filter;

import com.example.backend.common.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

public class JWTFilter extends OncePerRequestFilter {

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

            throw new ServletException("인증 되지 않은 토큰"); // "Bearer " 로 시작하지 않을시 예외처리
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

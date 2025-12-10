package com.example.backend.config;

import com.example.backend.domain.UserRoleType;
import com.example.backend.filter.JWTFilter;
import com.example.backend.filter.LoginFilter;
import com.example.backend.handler.LogoutSuccessHandler;
import com.example.backend.service.jwt.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final AuthenticationSuccessHandler loginSuccessHandler; // LoginSuccessHandler 구현체 주입받음
    private final AuthenticationSuccessHandler socialSuccessHandler;
    private final JwtService jwtService;


    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration,
                          @Qualifier("LoginSuccessHandler") AuthenticationSuccessHandler loginSuccessHandler,
                          @Qualifier("SocialSuccessHandler") AuthenticationSuccessHandler socialSuccessHandler,
                          JwtService jwtService) {

        this.authenticationConfiguration = authenticationConfiguration;
        this.loginSuccessHandler = loginSuccessHandler;
        this.socialSuccessHandler = socialSuccessHandler;
        this.jwtService = jwtService;
    }

    /**
     * 비밀번호 단방향 (BCrypt) 암호화용 Bean
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * CORS 설정
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization", "Set-Cookie"));
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * 권한 계층
     */
    @Bean
    public RoleHierarchy roleHierarchy() {
        return RoleHierarchyImpl.withRolePrefix("ROLE_")
                .role(UserRoleType.ADMIN.name()).implies(UserRoleType.ARTIST.name())
                .role(UserRoleType.ARTIST.name()).implies(UserRoleType.USER.name())
                .build();
    }

    /**
     * 커스텀 자체 로그인을 위한 AuthenticationManager Bean 수동 등록
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /**
     * Security FilterChain
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // CSRF 보안 필터 disable
        http
                .csrf(AbstractHttpConfigurer::disable);

        // CORS 설정
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));


        // JWTFilter Chain JWTFilter를 LogoutFilter 이전에 실행
        http
                .addFilterBefore(new JWTFilter(), LogoutFilter.class);

        // 로그아웃 필터 , RefreshToken 삭제 핸들러
        http
                .logout(logout -> logout
                        .addLogoutHandler(new LogoutSuccessHandler(jwtService)));

        // 기존 Form 기반 인증 필터들 disable
        http
                .formLogin(AbstractHttpConfigurer::disable);

        //OAuth2 인증용
        http
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(socialSuccessHandler));

        // 기존 Basic 기반 인증 필터 disable
        http
                .httpBasic(AbstractHttpConfigurer::disable);


        // 인가
        http
                .authorizeHttpRequests(auth -> auth
                        // 1. 전시 조회 (전체 + 단일) 누구나 허용
                        .requestMatchers(HttpMethod.GET, "/exhibition/all", "/exhibition/*", "/photo/*").permitAll()

                        // 2. 회원가입 등 공개
                        .requestMatchers(HttpMethod.POST, "/user/exist", "/user/join").permitAll()
                        .requestMatchers("/jwt/exchange", "/jwt/refresh").permitAll()

                        // 3. USER 권한 필요
                        .requestMatchers(HttpMethod.GET, "/exhibition/my", "/user", "/user/info", "/photo/my", "/templates", "/order/create").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/exhibition/create", "/s3/upload", "/photo/upload", "/photo/*/like/**", "/snsLink").hasRole("USER")
                        .requestMatchers(HttpMethod.PUT, "/exhibition/*", "/snsLink/*").hasRole("USER")
                        .requestMatchers(HttpMethod.DELETE, "/exhibition/*", "/photo/*", "/order/*", "/snsLink/*").hasRole("USER")
                        // 4. 그외 모든 요청 인증 필요
                        .anyRequest().authenticated()
                );

        // 예외 처리
        http
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED); // 401 응답
                        })
                        .accessDeniedHandler((request, response, authException) -> {
                            response.sendError(HttpServletResponse.SC_FORBIDDEN); // 403 응답
                        })
                );
        // 커스텀 필터 추가
        http
                .addFilterBefore(new LoginFilter(authenticationManager(authenticationConfiguration), loginSuccessHandler), UsernamePasswordAuthenticationFilter.class);

        // 세션 필터 설정 (STATELESS)
        http
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

}

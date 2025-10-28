package com.example.backend.service;

import com.example.backend.domain.SocialProviderType;
import com.example.backend.domain.UserRoleType;
import com.example.backend.domain.Users;
import com.example.backend.dto.CustomOAuth2User;
import com.example.backend.dto.UserRequestDTO;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService extends DefaultOAuth2UserService implements UserDetailsService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    /**
     * 자체 로그인 회원 가입 (존재 여부 검증)
     */
    @Transactional(readOnly = true)
    public Boolean existUser(UserRequestDTO dto) {

        return userRepository.existsByEmail(dto.getEmail());
    }

    /**
     * 자체 회원 가입
     */
    @Transactional
    public Long addUser(UserRequestDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 유저가 존재합니다.");
        }
        Users userEntity = Users.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .isLock(false)
                .isSocial(false)
                .userRoleType(UserRoleType.USER) // 기본적으로 일반 유저로 가입.
                .username(dto.getUsername())
                .nickname(dto.getNickname())
                .build();

        return userRepository.save(userEntity).getUserId();
    }

    /**
     * 자체 로그인
     * 파마리터에 email 로 검증 진행 해야하는데
     * 스프링 시큐리티가 내부적으로 username 밖에 못알아 듣기때문에
     * username 에 email 값을 넣어서 진행.
     * CustomUserDetails 클래스를 따로 만들어서 UserDetails를 직접 구현하는 방법도 있음.
     */
    @Transactional(readOnly = true)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Users userEntity = userRepository.findByEmailAndIsLockAndIsSocial(username, false, false)
                .orElseThrow(() -> new UsernameNotFoundException(username));

        return User.builder() // 스프링 시큐리티의 User 객체
                .username(userEntity.getEmail())
                .password(userEntity.getPassword())
                .roles(userEntity.getUserRoleType().name())
                .accountLocked(userEntity.getIsLock())
                .build();
    }

    /**
     * 자체 로그인 회원 정보 수정
     */
    @Transactional
    public Long updateUser(UserRequestDTO dto) throws AccessDeniedException {
        // 본인만 수정 가능 검증
        String sessionUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!sessionUserEmail.equals(dto.getEmail())) {
            throw new AccessDeniedException("본인 계정만 수정 가능.");
        }

        //조회
        Users userEntity = userRepository.findByEmailAndIsLockAndIsSocial(dto.getEmail(), false, false)
                .orElseThrow(() -> new UsernameNotFoundException(dto.getEmail()));

        // 회원 정보 수정
        userEntity.updateUser(dto);

        return userRepository.save(userEntity).getUserId();
    }

    /**
     * 회원 탈퇴
     */
    @Transactional
    public void deleteUser(UserRequestDTO dto) throws AccessDeniedException {
        // 본인과 어드민만 삭제 가능
        SecurityContext context = SecurityContextHolder.getContext();
        String sessionUsername = context.getAuthentication().getName(); //로그인 시, username 필드에 email 값 즉 getName = Email
        String role = context.getAuthentication().getAuthorities().iterator().next().getAuthority();

        boolean isOwner = sessionUsername.equals(dto.getEmail());
        boolean isAdmin = role.equals("ROLE_" + UserRoleType.ADMIN.name());

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("본인과 관리자만 삭제 할 수 있습니다");
        }

        // 유저 제거
        userRepository.deleteByEmail(dto.getEmail());

        // refreshToken 제거
        jwtService.deleteRefreshTokenByEmail(dto.getEmail());
        
    }

    /**
     * 소셜 로그인
     * DefaultOAuth2UserService 의 loadUser 재정의
     * super.loadUser()는 부모 클래스(DefaultOAuth2UserService)의 기본 구현체를 호출
     */
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 부모 메서드 호출
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 데이터
        Map<String, Object> attributes;
        List<GrantedAuthority> authorities;

        String email;
        String role = UserRoleType.USER.name();
        String username;
        String nickname;

        // Provider Google Or Naver 데이터 획득
        String registrationId = userRequest.getClientRegistration().getRegistrationId().toUpperCase(); // provider ID (GOOGLE, NAVER)
        if (registrationId.equals(SocialProviderType.NAVER.name())) {

            attributes = (Map<String, Object>) oAuth2User.getAttributes().get("response"); // 유저 정보(JSON) 를 담은 맵(Map) Key-Value 구조

            username = registrationId + "_" + attributes.get("id").toString(); //  각 소셜 로그인마다 id 충돌 방지
            email = attributes.get("email").toString();
            nickname = attributes.get("name").toString();

        } else if (registrationId.equals(SocialProviderType.GOOGLE.name())) {

            attributes = (Map<String, Object>) oAuth2User.getAttributes();

            username = registrationId + "_" + attributes.get("sub").toString();
            email = attributes.get("email").toString();
            nickname = attributes.get("name").toString();

        } else {
            throw new OAuth2AuthenticationException("지원하지 않는 소셜 로그인 입니다.");
        }
        // 데이터베이스 조회 -> 존재하면 업데이트, 없으면 신규 가입
        Optional<Users> userEntity = userRepository.findByEmailAndIsSocial(email, true);
        if (userEntity.isPresent()) {
            // role 조회
            role = userEntity.get().getUserRoleType().name();

            // 기존 유저 업데이트
            UserRequestDTO dto = new UserRequestDTO();
            dto.setEmail(email);
            dto.setNickname(nickname);
            userEntity.get().updateUser(dto);

        } else {
            // 신규 유저 추가
            Users newUserEntity = Users.builder()
                    .email(email)
                    .username(username)
                    .password("") // 소셜 로그인 이기떄문에 패스워드 불필요.
                    .isLock(false)
                    .isSocial(true)
                    .socialProviderType(SocialProviderType.valueOf(registrationId))
                    .userRoleType(UserRoleType.USER)
                    .nickname(nickname)
                    .build();
            userRepository.save(newUserEntity);

        }
        authorities = List.of(new SimpleGrantedAuthority(role)); // 권한 리스트

        return new CustomOAuth2User(attributes, authorities, username);
    }


}

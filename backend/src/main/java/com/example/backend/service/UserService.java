package com.example.backend.service;

import com.example.backend.domain.User;
import com.example.backend.domain.UserRoleType;
import com.example.backend.dto.UserRequestDTO;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

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
        User userEntity = User.builder()
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
        User userEntity = userRepository.findByEmailAndIsLockAndIsSocial(dto.getEmail(), false, false)
                .orElseThrow(() -> new UsernameNotFoundException(dto.getEmail()));

        // 회원 정보 수정
        userEntity.updateUser(dto);

        return userRepository.save(userEntity).getUserId();


    }


}

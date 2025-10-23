package com.example.backend.repository;


import com.example.backend.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {
    // 이메일 중복 검사
    Boolean existsByEmail(String email);

    // 회원 정보 수정시 자체 로그인 여부, 잠김 여부 검사
    Optional<Users> findByEmailAndIsLockAndIsSocial(String email, Boolean isLock, Boolean isSocial);


}

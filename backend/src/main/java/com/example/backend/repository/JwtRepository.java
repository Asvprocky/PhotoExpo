package com.example.backend.repository;

import com.example.backend.domain.JwtRefresh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface JwtRepository extends JpaRepository<JwtRefresh, Long> {

    Boolean existsByRefresh(String refreshToken);

    @Transactional
    void deleteByRefresh(String refreshToken);

    @Transactional
    void deleteByEmail(String email);
}

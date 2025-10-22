package com.example.backend.repository;

import com.example.backend.domain.JwtRefresh;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JwtRepository extends JpaRepository<JwtRefresh, Long> {
}

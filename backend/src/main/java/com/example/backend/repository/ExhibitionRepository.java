package com.example.backend.repository;

import com.example.backend.domain.Exhibition;
import com.example.backend.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExhibitionRepository extends JpaRepository<Exhibition, Long> {
    List<Exhibition> findAllByOrderByCreatedAtDesc();

    List<Exhibition> findByUserOrderByCreatedAtDesc(Users user);
}

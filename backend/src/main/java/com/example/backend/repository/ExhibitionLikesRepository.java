package com.example.backend.repository;

import com.example.backend.domain.Exhibition;
import com.example.backend.domain.ExhibitionLikes;
import com.example.backend.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExhibitionLikesRepository extends JpaRepository<ExhibitionLikes, Long> {
    boolean existsByExhibitionAndUser(Exhibition exhibition, Users user);

    Optional<ExhibitionLikes> findByExhibitionAndUser(Exhibition exhibition, Users user);

    Long countByExhibition(Exhibition exhibition);
}

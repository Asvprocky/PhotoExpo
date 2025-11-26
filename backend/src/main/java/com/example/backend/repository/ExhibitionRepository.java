package com.example.backend.repository;

import com.example.backend.domain.Exhibition;
import com.example.backend.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ExhibitionRepository extends JpaRepository<Exhibition, Long> {
    List<Exhibition> findAllByOrderByCreatedAtDesc();

    List<Exhibition> findByUserOrderByCreatedAtDesc(Users user);


    @Query("""
            SELECT e 
            FROM Exhibition e 
            LEFT JOIN FETCH e.photos 
            WHERE e.exhibitionId = :exhibitionId
            """)
    Optional<Exhibition> findByIdWithPhotos(Long exhibitionId);
}

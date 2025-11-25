package com.example.backend.repository;

import com.example.backend.domain.Photo;
import com.example.backend.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findByUser(Users user);

    List<Photo> findByExhibition_ExhibitionId(Long exhibitionId);
    
    List<Photo> findAllByOrderByPhotoViewCountDesc();

    List<Photo> findAllByOrderByCreatedAtDesc();
}

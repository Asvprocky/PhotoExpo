package com.example.backend.repository;

import com.example.backend.domain.Photo;
import com.example.backend.domain.PhotoLikes;
import com.example.backend.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PhotoLikesRepository extends JpaRepository<PhotoLikes, Long> {

    Optional<PhotoLikes> findByPhotoAndUser(Photo photo, Users user);

    Long countByPhoto(Photo photo);
}

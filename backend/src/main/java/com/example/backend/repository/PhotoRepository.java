package com.example.backend.repository;

import com.example.backend.domain.Photo;
import com.example.backend.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findByUserAndExhibitionIsNullOrderByCreatedAtDesc(Users user);


    List<Photo> findAllByOrderByPhotoViewCountDesc();

    List<Photo> findAllByOrderByCreatedAtDesc();

    // 최신순 + 전시 없는 사진
    List<Photo> findByExhibitionIsNullOrderByCreatedAtDesc();

    // 인기순 + 전시 없는 사진
    List<Photo> findByExhibitionIsNullOrderByPhotoViewCountDesc();

    // 유저 사진 목록 (유저 페이지)
    List<Photo> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    // 유저 사진 개수
    long countByUserUserId(Long userId);

    // 유저 페이지
    List<Photo> findByUserOrderByCreatedAtDesc(Users user);
}

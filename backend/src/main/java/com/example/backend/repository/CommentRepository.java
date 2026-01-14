package com.example.backend.repository;

import com.example.backend.domain.Comment;
import com.example.backend.domain.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 삭제 안된 사진의 댓글 최신순
    List<Comment> findByPhotoAndIsDeletedFalseOrderByCreatedAtDesc(Photo photo);
}

package com.example.backend.dto.response;

import com.example.backend.domain.Comment;

import java.time.LocalDateTime;

public record CommentResponseDTO(
        Long id,
        String nickname,
        String content,
        LocalDateTime createdAt,
        boolean mine

) {

    public static CommentResponseDTO fromEntity(Comment comment, boolean mine) {
        return new CommentResponseDTO(
                comment.getCommentId(),
                comment.getUser().getNickname(), // 핵심
                comment.getContent(),
                comment.getCreatedAt(),
                mine
        );
    }
}
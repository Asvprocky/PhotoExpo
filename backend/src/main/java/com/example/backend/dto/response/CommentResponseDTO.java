package com.example.backend.dto.response;

import com.example.backend.domain.Comment;
import jakarta.annotation.Nullable;

import java.time.LocalDateTime;

public record CommentResponseDTO(
        Long commentId,
        Long userId,

        @Nullable
        Long exhibitionId,
        @Nullable
        Long photoId,

        String contents,
        LocalDateTime createdAt
) {

    public static CommentResponseDTO fromEntity(Comment comment) {

        //안전하게 id 가져오는 정적 메서드
        Long safeExhibitionId = comment.getExhibition() != null ? comment.getExhibition().getExhibitionId() : null;
        Long safePhotoId = comment.getPhoto() != null ? comment.getPhoto().getPhotoId() : null;

        return new CommentResponseDTO(
                comment.getCommentId(),
                comment.getUser().getUserId(),
                safeExhibitionId,
                safePhotoId,
                comment.getContent(),
                comment.getCreatedAt()
        );

    }
}

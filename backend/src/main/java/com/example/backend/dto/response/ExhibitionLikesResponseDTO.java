package com.example.backend.dto.response;

public record ExhibitionLikesResponseDTO(
        Long likeCount,
        boolean isLiked
) {
}

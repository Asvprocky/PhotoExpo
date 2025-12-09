package com.example.backend.dto.response;

import com.example.backend.domain.Photo;

import java.time.LocalDateTime;

public record PhotoResponseDTO(
        Long photoId,
        String title,
        String description,
        String imageUrl,
        Long price,
        LocalDateTime createdAt,
        Long photoViewCount,
        Long userId,
        Long exhibitionId) {

    public static PhotoResponseDTO fromEntity(Photo photo) {
        return new PhotoResponseDTO(
                photo.getPhotoId(),
                photo.getTitle(),
                photo.getDescription(),
                photo.getImageUrl(),
                photo.getPrice(),
                photo.getCreatedAt(),
                photo.getPhotoViewCount(),
                photo.getUser().getUserId(),
                photo.getExhibition() == null ? null : photo.getExhibition().getExhibitionId()
        );
    }
}

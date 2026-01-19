package com.example.backend.dto.response;

import com.example.backend.domain.Photo;

import java.time.LocalDateTime;

public record PhotoCardResponseDTO(
        Long photoId,
        String imageUrl,
        String title,
        long likeCount,
        long viewCount,
        LocalDateTime createdAt,
        ExhibitionListResponseDTO exhibition

) {

    public static PhotoCardResponseDTO fromEntity(
            Photo photo,
            long likeCount
    ) {
        return new PhotoCardResponseDTO(
                photo.getPhotoId(),
                photo.getImageUrl(),
                photo.getTitle(),
                likeCount,
                photo.getPhotoViewCount(),
                photo.getCreatedAt(),
                photo.getExhibition() == null
                        ? null
                        : ExhibitionListResponseDTO.fromEntity(photo.getExhibition())
        );
    }
}
package com.example.backend.dto.response;

import com.example.backend.domain.Exhibition;

public record ExhibitionListResponseDTO(
        Long exhibitionId,
        String title,
        String thumbnailUrl
) {

    public static ExhibitionListResponseDTO fromEntity(Exhibition exhibition) {
        String thumbnailUrl = null;

        if (exhibition.getPhotos() != null && !exhibition.getPhotos().isEmpty()) {
            thumbnailUrl = exhibition.getPhotos().get(0).getImageUrl();
        }
        return new ExhibitionListResponseDTO(
                exhibition.getExhibitionId(),
                exhibition.getTitle(),
                thumbnailUrl
        );

    }
}

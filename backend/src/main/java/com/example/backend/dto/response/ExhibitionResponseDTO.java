package com.example.backend.dto.response;

import com.example.backend.domain.Exhibition;

public record ExhibitionResponseDTO(Long exhibitionId,
                                    String title,
                                    String contents,
                                    String template,
                                    String background,
                                    String layout,
                                    String fontColor,
                                    Long exhibitionViewCount,
                                    Long userId) {

    public static ExhibitionResponseDTO fromEntity(Exhibition exhibition) {
        return new ExhibitionResponseDTO(
                exhibition.getExhibitionId(),
                exhibition.getTitle(),
                exhibition.getContents(),
                exhibition.getTemplate(),
                exhibition.getBackground(),
                exhibition.getLayout(),
                exhibition.getFontColor(),
                exhibition.getExhibitionViewCount(),
                exhibition.getUser().getUserId()
        );
    }

}

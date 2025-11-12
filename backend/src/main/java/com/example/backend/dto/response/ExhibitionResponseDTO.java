package com.example.backend.dto.response;

public record ExhibitionResponseDTO(Long exhibitionId,
                                    String title,
                                    String contents,
                                    String template,
                                    String background,
                                    String layout,
                                    String fontColor,
                                    Long userId) {
    

}

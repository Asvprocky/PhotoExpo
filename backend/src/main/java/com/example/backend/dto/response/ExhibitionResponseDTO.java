package com.example.backend.dto.response;

import com.example.backend.domain.Exhibition;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
public record ExhibitionResponseDTO(Long exhibitionId,
                                    String title,
                                    String contents,
                                    String template,
                                    String background,
                                    String layout,
                                    String fontColor,
                                    Long exhibitionViewCount,
                                    LocalDateTime createdAt,
                                    Long userId,
                                    List<PhotoResponseDTO> photos) {


    public static ExhibitionResponseDTO fromEntity(Exhibition exhibition) {

        // 💡 Photo 목록을 PhotoResponseDTO 목록으로 변환하여 매핑
        List<PhotoResponseDTO> photoDtos =
                exhibition.getPhotos() == null
                        ? List.of()
                        : exhibition.getPhotos().stream()
                        .map(PhotoResponseDTO::fromEntity)
                        .toList();
        log.info("ExhibitionService, fromEntity - photoDtos : {}", photoDtos);
        return new ExhibitionResponseDTO(
                exhibition.getExhibitionId(),
                exhibition.getTitle(),
                exhibition.getContents(),
                exhibition.getTemplate(),
                exhibition.getBackground(),
                exhibition.getLayout(),
                exhibition.getFontColor(),
                exhibition.getExhibitionViewCount(),
                exhibition.getCreatedAt(),
                exhibition.getUser().getUserId(),
                photoDtos
        );
    }

}

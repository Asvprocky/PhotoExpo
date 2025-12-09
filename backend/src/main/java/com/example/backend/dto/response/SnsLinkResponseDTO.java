package com.example.backend.dto.response;

import com.example.backend.domain.SnsLinkPlatform;
import com.example.backend.domain.SnsLinks;

public record SnsLinkResponseDTO(
        String snsUrl,
        SnsLinkPlatform platform) {

    public static SnsLinkResponseDTO fromEntity(SnsLinks snsLinks) {
        return new SnsLinkResponseDTO(
                snsLinks.getSnsUrl(),
                snsLinks.getPlatform()
        );
    }
}

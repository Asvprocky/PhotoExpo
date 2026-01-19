package com.example.backend.dto.response;

import com.example.backend.domain.Users;

import java.util.List;

public record UserPageResponseDTO(
        Long userId,
        String username,
        String nickname,
        int photoCount,
        List<PhotoCardResponseDTO> photos
) {
    public static UserPageResponseDTO from(
            Users user,
            List<PhotoCardResponseDTO> photos
    ) {
        return new UserPageResponseDTO(
                user.getUserId(),
                user.getUsername(),
                user.getNickname(),
                photos.size(),
                photos
        );
    }
}
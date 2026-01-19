package com.example.backend.dto.response;

import com.example.backend.domain.Users;

public record UserResponseDTO(
        Long userId,
        String email,
        Boolean social,
        String username,
        String nickname) {

    public static UserResponseDTO fromEntity(String email, Users users) {
        return new UserResponseDTO(
                users.getUserId(),
                email,
                users.getIsSocial(),
                users.getUsername(),
                users.getNickname()
        );
    }

}

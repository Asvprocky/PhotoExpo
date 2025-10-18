package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestDTO {
    private String email;
    private String password;
    private String nickname;
    private String username;
}

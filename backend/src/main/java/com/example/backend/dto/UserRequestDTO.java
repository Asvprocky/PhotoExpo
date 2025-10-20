package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestDTO {
    private String email; // 로그인,회원가입용 식별자
    private String password;
    private String nickname;
    private String username;
}

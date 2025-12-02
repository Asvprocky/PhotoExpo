package com.example.backend.dto.request;

import com.example.backend.domain.Exhibition;
import com.example.backend.domain.Users;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExhibitionRequestDTO {

    @NotBlank
    private String title;

    @NotBlank
    private String contents;

    @NotBlank
    private String template;

    private String background;

    private String layout;

    private String font;

    private String fontColor;

    public Exhibition toEntity(Users user) {
        return Exhibition.builder()
                .title(this.title)
                .contents(this.contents)
                .template(this.template)
                .background(this.background)
                .layout(this.layout)
                .font(this.font)
                .fontColor(this.fontColor)
                .exhibitionViewCount(0L) // 기본값은 DTO가 책임
                .user(user) // 서비스에서 받은 유저 엔티티를 주입
                .build();
    }
}

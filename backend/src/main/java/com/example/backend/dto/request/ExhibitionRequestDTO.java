package com.example.backend.dto.request;

import com.example.backend.domain.Exhibition;
import com.example.backend.domain.Users;
import com.example.backend.dto.response.TemplateResponseDTO;
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

    private String template;

    private String background;

    private String layout;

    private String font;

    private String fontColor;

    public Exhibition toEntity(Users user, TemplateResponseDTO templateDetails) {
        return Exhibition.builder()
                .title(this.title)
                .contents(this.contents)
                .template(templateDetails.name())
                .background(templateDetails.background())
                .layout(templateDetails.layout())
                .font(templateDetails.font())
                .fontColor(templateDetails.fontColor())
                .exhibitionViewCount(0L) // 기본값은 DTO가 책임
                .user(user) // 서비스에서 받은 유저 엔티티를 주입
                .build();
    }
}

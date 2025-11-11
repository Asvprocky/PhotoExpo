package com.example.backend.dto.request;

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

    @NotBlank
    private String background;

    @NotBlank
    private String layout;

    @NotBlank
    private String fontColor;

}

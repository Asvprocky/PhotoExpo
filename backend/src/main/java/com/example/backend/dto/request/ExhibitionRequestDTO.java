package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExhibitionRequestDTO {

    private String title;
    private String contents;
    private String template;
    private String background;
    private String layout;
    private String fontColor;

}

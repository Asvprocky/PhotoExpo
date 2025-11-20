package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PhotoRequestDTO {
    
    private Long exhibitionId;

    @NotBlank
    private String title;
    private String description;
    private Long price;
}

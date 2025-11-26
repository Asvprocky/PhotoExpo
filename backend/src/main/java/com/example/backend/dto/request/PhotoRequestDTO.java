package com.example.backend.dto.request;

import com.example.backend.domain.Exhibition;
import com.example.backend.domain.Photo;
import com.example.backend.domain.Users;
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

    public Photo toEntity(Users user, Exhibition exhibition, String imageUrl) {
        return Photo.builder()
                .exhibition(exhibition)
                .title(this.title)
                .description(this.description)
                .price(this.price)
                .imageUrl(imageUrl)
                .user(user)
                .photoViewCount(0L)
                .build();

    }
}

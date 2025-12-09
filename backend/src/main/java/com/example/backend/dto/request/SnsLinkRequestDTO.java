package com.example.backend.dto.request;

import com.example.backend.domain.SnsLinkPlatform;
import com.example.backend.domain.SnsLinks;
import com.example.backend.domain.Users;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SnsLinkRequestDTO {
    private String snsUrl;
    private SnsLinkPlatform platform;

    public SnsLinks toEntity(Users user) {
        return SnsLinks.builder()
                .user(user)// 인자(user)를 사용하여 연관관계 설정
                .platform(this.platform) // this.platform은 DTO 객체 내부의 값
                .snsUrl(this.snsUrl)     // this.snsUrl은 DTO 객체 내부의 값
                .build();

    }

}

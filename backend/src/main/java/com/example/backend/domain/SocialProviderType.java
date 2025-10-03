package com.example.backend.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SocialProviderType {
    GOOGLE("구글"),
    NAVER("네이버");

    private final String description;


}

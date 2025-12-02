package com.example.backend.dto.response;

public record TemplateResponseDTO(
        String name,        // 템플릿 이름
        String displayName, // 템플릿 스타일
        String thumbnail,   // 썸네일 이미지 경로
        String layout,      // 레이아웃 스타일 (예: grid, list)
        String background,  // 배경 색상
        String font,        // 폰트 이름
        String fontColor    // 폰트 색상
) {
}

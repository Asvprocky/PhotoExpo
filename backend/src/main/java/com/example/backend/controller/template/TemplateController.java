package com.example.backend.controller.template;

import com.example.backend.dto.response.TemplateResponseDTO;
import com.example.backend.service.template.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TemplateController {
    private final TemplateService templateService;

    /**
     * 모든 템플릿 조회(템플릿 선택 화면)
     */
    @GetMapping("/templates")
    public ResponseEntity<List<TemplateResponseDTO>> getTemplates() {
        // 예시: 템플릿 이름 목록
        List<String> templateNames = List.of("default", "classic", "art");

        // 각 이름으로 TemplateResponseDTO 생성
        List<TemplateResponseDTO> templates = templateNames.stream()
                .map(templateService::getTemplateDetails)  // TemplateService에서 JSON 읽어 DTO로 변환
                .toList();

        return ResponseEntity.ok(templates);
    }
}

package com.example.backend.service.template;

import com.example.backend.dto.response.TemplateResponseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class TemplateService {
    private final ResourceLoader resourceLoader;
    private final ObjectMapper objectMapper; // JSON 파싱을 위한 객체 (주로 Jackson 사용)


    /**
     * 템플릿 조회 메서드
     *
     * @param templateName DB에 저장된 템플릿 이름 (예: "classic")
     * @return 템플릿 정보를 담은 ResponseDTO
     */
    public TemplateResponseDTO getTemplateDetails(String templateName) {

        // 1. Resource 경로 지정 (classpath:는 resources 폴더를 의미)
        String path = "classpath:templates/" + templateName + ".json";
        Resource resource = resourceLoader.getResource(path);

        try (InputStream inputStream = resource.getInputStream()) {

            // 2. JSON 파일을 TemplateDto 객체로 파싱
            // (TemplateDto는 JSON 구조와 일치하는 자바 클래스여야 함)
            TemplateResponseDTO templateDetails = objectMapper.readValue(inputStream, TemplateResponseDTO.class);

            // 3. 파싱된 템플릿 데이터 반환
            return templateDetails;

        } catch (IOException e) {
            // 파일을 찾지 못하거나, JSON 파싱에 실패했을 때 처리
            throw new RuntimeException("템플릿 파일을 찾거나 읽을 수 없습니다: " + templateName, e);
        }
    }
}

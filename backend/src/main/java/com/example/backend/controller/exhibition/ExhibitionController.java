package com.example.backend.controller.exhibition;

import com.example.backend.dto.request.ExhibitionRequestDTO;
import com.example.backend.dto.response.ExhibitionResponseDTO;
import com.example.backend.service.exhibition.ExhibitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exhibition")
public class ExhibitionController {

    private final ExhibitionService exhibitionService;

    @PostMapping(value = "/create", consumes = "application/json")
    public ResponseEntity<ExhibitionResponseDTO> createExhibition(
            @RequestBody ExhibitionRequestDTO dto
    ) {
        // 클라이언트에서 온 Request 값을 서비스에 전달후 서비스에서 Request 값과 response 에 필요한 값들은 종합 검증 후 클라이언트로 전달
        ExhibitionResponseDTO response = exhibitionService.createExhibition(dto);

        return ResponseEntity.status(201).body(response);

    }
}

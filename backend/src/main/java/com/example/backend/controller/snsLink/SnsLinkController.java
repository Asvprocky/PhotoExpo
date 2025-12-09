package com.example.backend.controller.snsLink;

import com.example.backend.dto.request.SnsLinkRequestDTO;
import com.example.backend.dto.response.SnsLinkResponseDTO;
import com.example.backend.service.snsLink.SnsLinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/snsLink")
@RequiredArgsConstructor
public class SnsLinkController {

    private final SnsLinkService snsLinkService;

    @PostMapping
    public ResponseEntity<SnsLinkResponseDTO> snsLink(@RequestBody SnsLinkRequestDTO dto) {
        SnsLinkResponseDTO snsLinkResponseDTO = snsLinkService.createSnsLink(dto);
        return ResponseEntity.status(200).body(snsLinkResponseDTO);

    }
}

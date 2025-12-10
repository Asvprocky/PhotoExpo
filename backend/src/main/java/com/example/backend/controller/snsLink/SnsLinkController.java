package com.example.backend.controller.snsLink;

import com.example.backend.dto.request.SnsLinkRequestDTO;
import com.example.backend.dto.response.SnsLinkResponseDTO;
import com.example.backend.service.snsLink.SnsLinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/snsLink")
@RequiredArgsConstructor
public class SnsLinkController {

    private final SnsLinkService snsLinkService;

    /**
     * 링크 생성
     */
    @PostMapping
    public ResponseEntity<SnsLinkResponseDTO> snsLink(@RequestBody SnsLinkRequestDTO dto) {
        SnsLinkResponseDTO snsLinkResponseDTO = snsLinkService.createSnsLink(dto);
        return ResponseEntity.status(200).body(snsLinkResponseDTO);

    }

    /**
     * 링크 수정
     */
    @PutMapping("/{snsLink}")
    public ResponseEntity<SnsLinkResponseDTO> snsLinkUpdate(
            @PathVariable Long snsLink,
            @RequestBody SnsLinkRequestDTO dto
    ) {
        SnsLinkResponseDTO snsLinkResponseDTO = snsLinkService.updateSnsLink(snsLink, dto);
        return ResponseEntity.status(200).body(snsLinkResponseDTO);
    }

    /**
     * 링크 삭제
     */
    @DeleteMapping("/{snsLink}")
    public ResponseEntity<Void> snsLinkDelete(@PathVariable Long snsLink) {
        snsLinkService.deleteSnsLink(snsLink);
        return ResponseEntity.status(204).build();
    }
}

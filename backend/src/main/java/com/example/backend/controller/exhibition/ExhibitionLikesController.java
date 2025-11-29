package com.example.backend.controller.exhibition;

import com.example.backend.dto.response.ExhibitionLikesResponseDTO;
import com.example.backend.service.exhibition.ExhibitionLikesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exhibition/{exhibitionId}/like")
public class ExhibitionLikesController {

    private final ExhibitionLikesService exhibitionLikesService;

    @PostMapping(value = "/toggle")
    public ResponseEntity<ExhibitionLikesResponseDTO> toggleExhibitionLike(@PathVariable Long exhibitionId) {
        ExhibitionLikesResponseDTO likes = exhibitionLikesService.toggleLike(exhibitionId);
        return ResponseEntity.status(200).body(likes);

    }
}

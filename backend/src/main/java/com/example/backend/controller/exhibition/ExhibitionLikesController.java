package com.example.backend.controller.exhibition;

import com.example.backend.dto.response.ExhibitionLikesResponseDTO;
import com.example.backend.service.exhibition.ExhibitionLikesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public ResponseEntity<ExhibitionLikesResponseDTO> getLikeStatus(
            @PathVariable Long exhibitionId,
            Authentication authentication) {
        
        String email = null;

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetails) {
                email = ((UserDetails) principal).getUsername();
            } else if (principal instanceof String) {
                email = (String) principal;
            }
        }


        ExhibitionLikesResponseDTO likes = exhibitionLikesService.getLikeStatus(exhibitionId, email);
        return ResponseEntity.status(200).body(likes);
    }
}

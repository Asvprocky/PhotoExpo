package com.example.backend.controller.photo;

import com.example.backend.dto.response.PhotoLikesResponseDTO;
import com.example.backend.service.photo.PhotoLikesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/photo/{photoId}/like")
public class PhotoLikesController {

    private final PhotoLikesService photoLikesService;

    /**
     * 사진 좋아요 토글
     */
    @PostMapping("/toggle")
    public ResponseEntity<PhotoLikesResponseDTO> togglePhotoLike(@PathVariable Long photoId) {
        PhotoLikesResponseDTO likes = photoLikesService.toggleLike(photoId);
        return ResponseEntity.status(200).body(likes);

    }

    /**
     * 사진 좋아요 조회
     */
    @GetMapping
    public PhotoLikesResponseDTO getLikeStatus(
            @PathVariable Long photoId,
            Authentication authentication
    ) {
        String email = null;

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetails) {
                email = ((UserDetails) principal).getUsername();
            } else if (principal instanceof String) {
                email = (String) principal;
            }
        }

        // Service의 getLikeStatus 메서드가 UserDetails 대신 Email(String)을 받도록 수정하거나,
        // 아래처럼 이메일을 기반으로 좋아요 상태를 조회하도록 변경하세요.
        return photoLikesService.getLikeStatus(photoId, email);
    }

}

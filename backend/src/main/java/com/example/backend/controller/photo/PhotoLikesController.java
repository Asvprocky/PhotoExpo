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
        UserDetails userDetails = null;

        if (authentication != null
                && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof UserDetails) {

            userDetails = (UserDetails) authentication.getPrincipal();
        }

        return photoLikesService.getLikeStatus(photoId, userDetails);
    }

}

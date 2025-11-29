package com.example.backend.controller.photo;

import com.example.backend.dto.response.PhotoLikesResponseDTO;
import com.example.backend.service.photo.PhotoLikesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/photo/{photoId}/like")
public class PhotoLikesController {

    private final PhotoLikesService photoLikesService;

    public PhotoLikesController(PhotoLikesService photoLikesService) {
        this.photoLikesService = photoLikesService;
    }

    @PostMapping("/toggle")
    public ResponseEntity<PhotoLikesResponseDTO> togglePhotoLike(@PathVariable Long photoId) {
        PhotoLikesResponseDTO likes = photoLikesService.toggleLike(photoId);
        return ResponseEntity.status(200).body(likes);

    }

}

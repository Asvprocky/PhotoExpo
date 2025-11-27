package com.example.backend.controller.photo;

import com.example.backend.dto.request.PhotoRequestDTO;
import com.example.backend.dto.response.PhotoResponseDTO;
import com.example.backend.service.photo.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/photo")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    /**
     * 사진 업로드
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<PhotoResponseDTO>> uploadPhotos(
            @RequestPart(value = "image") List<MultipartFile> files,
            @RequestPart(value = "dto") PhotoRequestDTO dto
    ) {
        List<PhotoResponseDTO> response = photoService.uploadPhoto(files, dto);

        return ResponseEntity.status(200).body(response);

    }

    /**
     * 단일 사진 조회
     */
    @GetMapping(value = "/{photoId}")
    public ResponseEntity<PhotoResponseDTO> getPhoto(@PathVariable Long photoId) {
        PhotoResponseDTO photo = photoService.getPhoto(photoId);

        return ResponseEntity.status(200).body(photo);
    }

    /**
     * 내 사진 조회
     */
    @GetMapping(value = "/my")
    public ResponseEntity<List<PhotoResponseDTO>> getMyPhotos() {
        List<PhotoResponseDTO> photos = photoService.getMyPhoto();
        return ResponseEntity.status(200).body(photos);
    }

    /**
     * 전체 사진 조회
     */
    @GetMapping(value = "/all")
    public ResponseEntity<List<PhotoResponseDTO>> getAllPhotos(
            @RequestParam(defaultValue = "newest") String sort
    ) {
        List<PhotoResponseDTO> photos = photoService.getAllPhotos(sort);
        return ResponseEntity.status(200).body(photos);

    }
}

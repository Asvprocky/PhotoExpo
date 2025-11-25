package com.example.backend.controller.photo;

import com.example.backend.domain.Photo;
import com.example.backend.dto.request.PhotoRequestDTO;
import com.example.backend.dto.response.PhotoResponseDTO;
import com.example.backend.service.photo.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
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
        List<Photo> savePhotos = photoService.uploadPhoto(files, dto);

        List<PhotoResponseDTO> response = savePhotos.stream()
                .map(PhotoResponseDTO::fromEntity)
                .toList();
        return ResponseEntity.status(200).body(response);

    }
}

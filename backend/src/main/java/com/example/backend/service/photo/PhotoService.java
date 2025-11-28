package com.example.backend.service.photo;

import com.example.backend.domain.Exhibition;
import com.example.backend.domain.Photo;
import com.example.backend.domain.Users;
import com.example.backend.dto.request.PhotoRequestDTO;
import com.example.backend.dto.response.PhotoResponseDTO;
import com.example.backend.repository.ExhibitionRepository;
import com.example.backend.repository.PhotoRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.aws.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final S3Service s3Service;
    private final ExhibitionRepository exhibitionRepository;
    private final UserRepository userRepository;

    @Transactional
    public List<PhotoResponseDTO> uploadPhoto(
            List<MultipartFile> files,
            PhotoRequestDTO dto
    ) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("photoService email : {}", email);
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // exhibition 처리 (null 가능)  한 번만 값이 할당됨
        final Exhibition exhibition = dto.getExhibitionId() == null ? null :
                exhibitionRepository.findById(dto.getExhibitionId())
                        .orElseThrow(() -> new RuntimeException("Exhibition not found"));
        
        // S3 업로드 후  Url 반환
        List<String> urls = s3Service.upload(files);
        log.info("photoService file URLS{}", urls);


        // 1. DB 저장 (엔티티 목록)
        List<Photo> savedPhotos = urls.stream()
                .map(url -> dto.toEntity(user, exhibition, url))
                .map(photoRepository::save)
                .toList();

        // 2. 엔티티 목록을 DTO 목록으로 변환하여 반환 (추가된 로직)
        return savedPhotos.stream()
                .map(PhotoResponseDTO::fromEntity) // DTO 변환 메서드 사용
                .toList();
    }

    /**
     * 사진 조회
     * 조회수 증가
     */
    @Transactional
    public PhotoResponseDTO getPhoto(Long photoId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));
        photo.increaseViewCount();

        return PhotoResponseDTO.fromEntity(photo);

    }

    /**
     * 내 사진 조회
     */
    @Transactional(readOnly = true)
    public List<PhotoResponseDTO> getMyPhoto() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Photo> photos = photoRepository.findByUser(user);

        return photos.stream()
                .map(PhotoResponseDTO::fromEntity)
                .toList();
    }


    /**
     * 모든 사진 조회
     * 조회시 인기순과 최신순
     */
    @Transactional(readOnly = true)
    public List<PhotoResponseDTO> getAllPhotos(String sort) {
        List<Photo> photos;

        if ("popular".equals(sort)) {
            photos = photoRepository.findAllByOrderByPhotoViewCountDesc();
        } else {
            photos = photoRepository.findAllByOrderByCreatedAtDesc();
        }
        return photos.stream()
                .map(PhotoResponseDTO::fromEntity)
                .toList();
    }

    /**
     * 자신 사진 삭제
     */
    @Transactional
    public void deletePhoto(Long photoId) throws AccessDeniedException {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));
        if (!currentEmail.equals(photo.getUser().getEmail())) {
            throw new AccessDeniedException("소유자만 삭제 할 수 있습니다.");

        }
        photoRepository.delete(photo);


    }
}

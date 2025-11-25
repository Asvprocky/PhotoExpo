package com.example.backend.service.photo;

import com.example.backend.domain.Exhibition;
import com.example.backend.domain.Photo;
import com.example.backend.domain.Users;
import com.example.backend.dto.request.PhotoRequestDTO;
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
    public List<Photo> uploadPhoto(
            List<MultipartFile> files,
            PhotoRequestDTO dto
    ) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("photoService email : {}", email);
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // S3 업로드 후  Url 반환
        List<String> urls = s3Service.upload(files);
        log.info("photoService file URLS{}", urls);

        // exhibition 처리 (null 가능)  한 번만 값이 할당됨
        final Exhibition exhibition = dto.getExhibitionId() == null ? null :
                exhibitionRepository.findById(dto.getExhibitionId())
                        .orElseThrow(() -> new RuntimeException("Exhibition not found"));

        // DB 저장
        return urls.stream()
                .map(url -> Photo.builder()
                        .user(user)
                        .exhibition(exhibition)
                        .title(dto.getTitle())
                        .description(dto.getDescription())
                        .price(dto.getPrice())
                        .imageUrl(url)
                        .photoViewCount(0L)
                        .build())
                .map(photoRepository::save)
                .toList();
    }

    /**
     * 사진 조회
     * 조회수 증가
     */
    @Transactional
    public Photo getPhoto(Long photoId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));
        photo.increaseViewCount();
        return photo;
    }

    /**
     * 내 사진 조회
     */
    @Transactional(readOnly = true)
    public List<Photo> getMyPhoto(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return photoRepository.findByUser(user);
    }

    @Transactional(readOnly = true)
    public List<Photo> getPhotoByExhibition(Long exhibitionId) {
        return photoRepository.findByExhibition_ExhibitionId(exhibitionId);

    }

    /**
     * 모든 사진 조회
     * 조회시 인기순과 최신순
     */
    @Transactional(readOnly = true)
    public List<Photo> getAllPhotos(String sort) {
        if ("popular".equals(sort)) {
            return photoRepository.findAllByOrderByPhotoViewCountDesc();
        }
        return photoRepository.findAllByOrderByCreatedAtDesc();
    }
}

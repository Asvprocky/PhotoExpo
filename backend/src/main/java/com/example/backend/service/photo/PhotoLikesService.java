package com.example.backend.service.photo;

import com.example.backend.domain.Photo;
import com.example.backend.domain.PhotoLikes;
import com.example.backend.domain.Users;
import com.example.backend.dto.response.PhotoLikesResponseDTO;
import com.example.backend.repository.PhotoLikesRepository;
import com.example.backend.repository.PhotoRepository;
import com.example.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PhotoLikesService {
    private final UserRepository userRepository;
    private final PhotoRepository photoRepository;
    private final PhotoLikesRepository photoLikesRepository;


    /**
     * 사진 좋아요 메서드
     * photo와 user라는 두 인자만으로 이 user가 이 photo에 좋아요를 눌렀는지 를 DB에서 조회해서 확인하는 구조
     */
    public PhotoLikesResponseDTO toggleLike(Long photoId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        // 이미 좋아요 했는지 체크 ( user 와 photo 의 묶여있는 연관관계를 확인)
        Optional<PhotoLikes> existingLike = photoLikesRepository.findByPhotoAndUser(photo, user);

        // 값이 있을시
        if (existingLike.isPresent()) {
            // 삭제
            photoLikesRepository.delete(existingLike.get());
            // 삭제후 DB 에 photoId(photo) 로 된 값들 갯수 가져와서 저장.
            long count = photoLikesRepository.countByPhoto(photo);
            return new PhotoLikesResponseDTO(count, false);
        }
        // 없을시 photo & user 연결 저장
        PhotoLikes likes = PhotoLikes.builder()
                .photo(photo)
                .user(user)
                .build();
        photoLikesRepository.save(likes);

        //  count 의 수는 PhotoLikes DB 에 레코드에 남아있는 Photo_id 수와 같음
        long count = photoLikesRepository.countByPhoto(photo);
        return new PhotoLikesResponseDTO(count, true);
    }

    /**
     * 좋아요 조회
     */
    @Transactional(readOnly = true)
    public PhotoLikesResponseDTO getLikeStatus(Long photoId, UserDetails userDetails) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new EntityNotFoundException("Photo not found"));

        long likeCount = photoLikesRepository.countByPhoto(photo);

        boolean liked = false;
        if (userDetails != null) {
            Users user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
            liked = photoLikesRepository.existsByPhotoAndUser(photo, user);
        }

        return new PhotoLikesResponseDTO(likeCount, liked);
    }
}

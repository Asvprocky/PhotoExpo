package com.example.backend.service.photo;

import com.example.backend.domain.Photo;
import com.example.backend.domain.PhotoLikes;
import com.example.backend.domain.Users;
import com.example.backend.dto.response.PhotoLikesResponseDTO;
import com.example.backend.repository.PhotoLikesRepository;
import com.example.backend.repository.PhotoRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PhotoLikesService {
    private final UserRepository userRepository;
    private final PhotoRepository photoRepository;
    private final PhotoLikesRepository photoLikesRepository;

    public PhotoLikesResponseDTO toggleLike(Long photoId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        // 이미 좋아요 했는지 체크
        Optional<PhotoLikes> existingLike = photoLikesRepository.findByPhotoAndUser(photo, user);

        if (existingLike.isPresent()) {
            photoLikesRepository.delete(existingLike.get());
            long count = photoLikesRepository.countByPhoto(photo);
            return new PhotoLikesResponseDTO(count, false);
        }
        PhotoLikes likes = PhotoLikes.builder()
                .photo(photo)
                .user(user)
                .build();
        photoLikesRepository.save(likes);
        
        long count = photoLikesRepository.countByPhoto(photo);
        return new PhotoLikesResponseDTO(count, true);
    }
}

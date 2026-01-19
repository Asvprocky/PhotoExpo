package com.example.backend.service.user;

import com.example.backend.domain.Photo;
import com.example.backend.domain.Users;
import com.example.backend.dto.response.PhotoCardResponseDTO;
import com.example.backend.dto.response.UserPageResponseDTO;
import com.example.backend.repository.PhotoLikesRepository;
import com.example.backend.repository.PhotoRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserPageService {

    private final UserRepository userRepository;
    private final PhotoRepository photoRepository;
    private final PhotoLikesRepository photoLikesRepository;

    @Transactional(readOnly = true)
    public UserPageResponseDTO getUserPage(Long userId) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        // 유저 정보
        List<Photo> photos =
                photoRepository.findByUserOrderByCreatedAtDesc(user);

        // Photo → PhotoCard DTO 변환
        List<PhotoCardResponseDTO> photoCards = photos.stream()
                .map(photo -> PhotoCardResponseDTO.fromEntity(
                        photo,
                        photoLikesRepository.countByPhotoPhotoId(photo.getPhotoId())
                ))
                .toList();

        return UserPageResponseDTO.from(user, photoCards);
    }
}

package com.example.backend.service.exhibition;

import com.example.backend.domain.Exhibition;
import com.example.backend.domain.ExhibitionLikes;
import com.example.backend.domain.Users;
import com.example.backend.dto.response.ExhibitionLikesResponseDTO;
import com.example.backend.repository.ExhibitionLikesRepository;
import com.example.backend.repository.ExhibitionRepository;
import com.example.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExhibitionLikesService {

    private final UserRepository userRepository;
    private final ExhibitionRepository exhibitionRepository;
    private final ExhibitionLikesRepository exhibitionLikesRepository;


    /**
     * 전시 좋아요 메서드
     *
     * @param exhibitionId
     * @return
     */

    public ExhibitionLikesResponseDTO toggleLike(Long exhibitionId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Exhibition exhibition = exhibitionRepository.findById(exhibitionId)
                .orElseThrow(() -> new RuntimeException("Exhibition not found"));

        // 이미 좋아요 했는지 체크
        Optional<ExhibitionLikes> existingLike = exhibitionLikesRepository.findByExhibitionAndUser(exhibition, user);

        if (existingLike.isPresent()) {
            exhibitionLikesRepository.delete(existingLike.get());
            long count = exhibitionLikesRepository.countByExhibition(exhibition);
            return new ExhibitionLikesResponseDTO(count, false);
        }
        ExhibitionLikes likes = ExhibitionLikes.builder()
                .exhibition(exhibition)
                .user(user)
                .build();
        exhibitionLikesRepository.save(likes);

        long count = exhibitionLikesRepository.countByExhibition(exhibition);
        return new ExhibitionLikesResponseDTO(count, true);

    }

    /**
     * 전시 좋아요 조회
     */
    @Transactional(readOnly = true)
    public ExhibitionLikesResponseDTO getLikeStatus(
            Long exhibitionId,
            String email
    ) {
        Exhibition exhibition = exhibitionRepository.findById(exhibitionId)
                .orElseThrow(() -> new EntityNotFoundException("Exhibition not found"));

        long likeCount = exhibitionLikesRepository.countByExhibition(exhibition);

        boolean liked = false;
        if (email != null) {
            Users user = userRepository.findByEmail(email).orElseThrow();
            liked = exhibitionLikesRepository.existsByExhibitionAndUser(exhibition, user);
        }

        return new ExhibitionLikesResponseDTO(likeCount, liked);
    }

}

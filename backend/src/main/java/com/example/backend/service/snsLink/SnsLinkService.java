package com.example.backend.service.snsLink;

import com.example.backend.domain.SnsLinks;
import com.example.backend.domain.Users;
import com.example.backend.dto.request.SnsLinkRequestDTO;
import com.example.backend.dto.response.SnsLinkResponseDTO;
import com.example.backend.repository.SnsLinkRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SnsLinkService {

    private final UserRepository userRepository;
    private final SnsLinkRepository snsLinkRepository;

    /**
     * SnsLink 생성 메서드
     */
    @Transactional
    public SnsLinkResponseDTO createSnsLink(SnsLinkRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SnsLinks snsLinks = dto.toEntity(user);

        snsLinkRepository.save(snsLinks);

        return SnsLinkResponseDTO.fromEntity(snsLinks);

    }

    /**
     * 링크 수정 메서드
     */

    @Transactional
    public SnsLinkResponseDTO updateSnsLink(Long snsLinkId, SnsLinkRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        SnsLinks snsLinks = snsLinkRepository.findById(snsLinkId)
                .orElseThrow(() -> new RuntimeException("SnsLink not found"));

        if (!Objects.equals(snsLinks.getUser().getEmail(), email)) {
            throw new SecurityException("본인만 수정 할 수 있습니다");
        }
        snsLinks.updateLink(dto);

        snsLinkRepository.save(snsLinks);

        return SnsLinkResponseDTO.fromEntity(snsLinks);

    }

    /**
     * 링크 삭제
     */
    @Transactional
    public void deleteSnsLink(Long snsLinkId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SnsLinks snsLinks = snsLinkRepository.findById(snsLinkId)
                .orElseThrow(() -> new RuntimeException("SnsLink not found"));

        if (!user.equals(snsLinks.getUser())) {
            throw new SecurityException("본인만 삭제 할 수 있습니다");
        }

        snsLinkRepository.delete(snsLinks);
    }
}

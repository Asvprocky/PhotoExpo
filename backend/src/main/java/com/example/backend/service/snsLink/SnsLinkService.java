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

@Service
@RequiredArgsConstructor
public class SnsLinkService {

    private final UserRepository userRepository;
    private final SnsLinkRepository snsLinkRepository;

    @Transactional
    public SnsLinkResponseDTO createSnsLink(SnsLinkRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SnsLinks snsLinks = dto.toEntity(user);

        snsLinkRepository.save(snsLinks);

        return SnsLinkResponseDTO.fromEntity(snsLinks);

    }
}

package com.example.backend.service.exhibition;

import com.example.backend.domain.Exhibition;
import com.example.backend.domain.Users;
import com.example.backend.dto.request.ExhibitionRequestDTO;
import com.example.backend.dto.response.ExhibitionResponseDTO;
import com.example.backend.repository.ExhibitionRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ExhibitionService {
    private final ExhibitionRepository exhibitionRepository;
    private final UserRepository userRepository;

    @Transactional
    public ExhibitionResponseDTO createExhibition(ExhibitionRequestDTO dto) {
        // 현재 로그인된 사용자 정보 가져오기
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Exhibition Entity 생성
        Exhibition exhibition = Exhibition.builder()
                .title(dto.getTitle())
                .contents(dto.getContents())
                .template(dto.getTemplate())
                .background(dto.getBackground())
                .layout(dto.getLayout())
                .fontColor(dto.getFontColor())
                .user(user)
                .build();

        // 저장
        Exhibition saved = exhibitionRepository.save(exhibition);

        // 응답 DTO 변환
        return new ExhibitionResponseDTO(
                saved.getExhibitionId(),
                saved.getTitle(),
                saved.getContents(),
                saved.getTemplate(),
                saved.getBackground(),
                saved.getLayout(),
                saved.getFontColor(),
                saved.getUser().getUserId());
    }


}

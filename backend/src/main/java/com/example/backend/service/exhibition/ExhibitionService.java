package com.example.backend.service.exhibition;

import com.example.backend.domain.Exhibition;
import com.example.backend.domain.Users;
import com.example.backend.dto.request.ExhibitionRequestDTO;
import com.example.backend.dto.response.ExhibitionResponseDTO;
import com.example.backend.repository.ExhibitionRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
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
        log.info("Exhibition Service,  createExhibition - user : {}", user);

        // Exhibition Entity 생성 (클라이언트에서 받은 값을 저장)
        Exhibition exhibition = Exhibition.builder()
                .title(dto.getTitle())
                .contents(dto.getContents())
                .template(dto.getTemplate())
                .background(dto.getBackground())
                .layout(dto.getLayout())
                .fontColor(dto.getFontColor())
                .user(user) // 사용자 연결 (연관 관계)
                .build();

        // DB 에 저장과 동시에 DB에서 생성된 값을 채워서 반환
        Exhibition saved = exhibitionRepository.save(exhibition);

        // 응답 DTO 변환 (저장한 값을 컨트롤러를 통해 클라이언트에 전달)
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

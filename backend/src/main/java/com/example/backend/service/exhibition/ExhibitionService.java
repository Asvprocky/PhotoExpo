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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExhibitionService {
    private final ExhibitionRepository exhibitionRepository;
    private final UserRepository userRepository;


    /**
     * 전시회 생성
     * Security ContextHolder 에 로그인된 사용자 정보 추출
     * 추출한 정보로 유효성 검증
     * 검증 후 클라이언트에서 받은 값과 검증된 유저를 추출해 빌더로 Exhibition Entity 새로운 객체 생성
     * 생성한 Entity 를 DB 에 저장후 saved 변수에 담음
     * saved 변수에 값을 추출해서 ResponseDTO 를 클라이언트에 전해주기위해 컨트롤러로 리턴.
     */
    @Transactional
    public ExhibitionResponseDTO createExhibition(ExhibitionRequestDTO dto) {
        // 현재 로그인된 사용자 정보 가져오기
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        log.info("Exhibition Service, createExhibition - user : {}", user);

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

    /**
     * 모든 전시 조회
     * DB에서 모든 전시회를 createdAt 기준 내림차순으로 불러오고
     * 각 전시회(Exhibition 엔티티)를 필요한 정보만 있는  ExhibitionResponseDTO로 변환해서
     * List 로 반환
     */
    @Transactional(readOnly = true)
    public List<ExhibitionResponseDTO> getAllExhibition() {

        //엔티티 객체(Exhibition)의 리스트를 반환
        return exhibitionRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(exhibition -> new ExhibitionResponseDTO( // 스트림에서 하나씩 넘어오는 exhibition entity 를 ResponseDTO 로 변환 작업
                        exhibition.getExhibitionId(), // entity 값 추출후 내부에서 ExhibitionResponseDTO에 넣어줌
                        exhibition.getTitle(),
                        exhibition.getContents(),
                        exhibition.getTemplate(),
                        exhibition.getBackground(),
                        exhibition.getLayout(),
                        exhibition.getFontColor(),
                        exhibition.getUser().getUserId()
                ))
                .toList(); // 스트림 타입을 다시 리스트로 변환
    }

    /**
     * 단일 전시 조회
     */
    @Transactional(readOnly = true)
    public ExhibitionResponseDTO getExhibitionById(Long exhibitionId) {
        Exhibition exhibition = exhibitionRepository.findById(exhibitionId)
                .orElseThrow(() -> new UsernameNotFoundException("존재 하지 않는 유저 입니다."));

        return new ExhibitionResponseDTO(
                exhibition.getExhibitionId(),
                exhibition.getTitle(),
                exhibition.getContents(),
                exhibition.getTemplate(),
                exhibition.getBackground(),
                exhibition.getLayout(),
                exhibition.getFontColor(),
                exhibition.getUser().getUserId()
        );
    }


}

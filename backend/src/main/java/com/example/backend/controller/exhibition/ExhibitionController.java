package com.example.backend.controller.exhibition;

import com.example.backend.dto.request.ExhibitionRequestDTO;
import com.example.backend.dto.response.ExhibitionResponseDTO;
import com.example.backend.service.exhibition.ExhibitionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/exhibition")
public class ExhibitionController {

    private final ExhibitionService exhibitionService;

    /**
     * 전시회 생성
     */
    @PostMapping(value = "/create", consumes = "application/json")
    public ResponseEntity<ExhibitionResponseDTO> createExhibition(
            @RequestBody ExhibitionRequestDTO dto
    ) {
        // 클라이언트에서 온 Request 값을 서비스에 전달후 서비스에서 Request 값과 response 에 필요한 값들은 종합 검증 후 클라이언트로 전달
        ExhibitionResponseDTO response = exhibitionService.createExhibition(dto);

        return ResponseEntity.status(201).body(response);
    }

    /**
     * 모든 전시회 조회
     * 조회시 모든 사진도 다 보임
     * 이건 프론트단에서 첫번째 사진만 썸네일 처럼 가져와서 보이게 구현
     */
    @GetMapping(value = "/all")
    public ResponseEntity<List<ExhibitionResponseDTO>> getAllExhibition() {
        List<ExhibitionResponseDTO> exhibition = exhibitionService.getAllExhibition();
        return ResponseEntity.status(200).body(exhibition);

    }

    /**
     * 단일 전시회 조회
     * 프론트에서 수정용도로 두가지 사용
     */
    @GetMapping(value = "/{exhibitionId}")
    public ResponseEntity<ExhibitionResponseDTO> getExhibitionById(@PathVariable Long exhibitionId) {
        ExhibitionResponseDTO exhibition = exhibitionService.getExhibitionById(exhibitionId);
        return ResponseEntity.status(200).body(exhibition);

    }

    /**
     * 자신 전시회 조회
     */
    @GetMapping(value = "/my")
    public ResponseEntity<List<ExhibitionResponseDTO>> getMyExhibition() {
        List<ExhibitionResponseDTO> exhibition = exhibitionService.getMyExhibition();
        return ResponseEntity.status(200).body(exhibition);
    }

    /**
     * 자신 전시회 수정
     * 수정할때 기존 값은 단일 전시회 조회 에서 가져와서 사용 할 생각
     */
    @PutMapping(value = "/{exhibitionId}", consumes = "application/json")
    public ResponseEntity<ExhibitionResponseDTO> updateExhibition(
            @PathVariable Long exhibitionId,
            @RequestBody ExhibitionRequestDTO dto) {

        ExhibitionResponseDTO exhibition = exhibitionService.updateExhibition(exhibitionId, dto);
        return ResponseEntity.status(200).body(exhibition);
    }

    /**
     * 자신 전시회 삭제
     */
    @DeleteMapping(value = "/{exhibitionId}")
    public ResponseEntity<Void> deleteExhibition(@PathVariable Long exhibitionId) {
        exhibitionService.deleteExhibition(exhibitionId);
        return ResponseEntity.status(204).build();

    }
}

package com.example.backend.service.comment;

import com.example.backend.domain.Comment;
import com.example.backend.domain.Exhibition;
import com.example.backend.domain.Photo;
import com.example.backend.domain.Users;
import com.example.backend.dto.request.CommentRequestDTO;
import com.example.backend.dto.response.CommentResponseDTO;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.ExhibitionRepository;
import com.example.backend.repository.PhotoRepository;
import com.example.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j

public class CommentService {

    private final UserRepository userRepository;
    private final PhotoRepository photoRepository;
    private final ExhibitionRepository exhibitionRepository;
    private final CommentRepository commentRepository;


    /**
     * 댓글 작성 메서드
     * Exhibition ID 와 PhotoID 둘다 댓글 작성 가능
     * 둘중 하나만 값을 받아 유효성 검증 이후 저장
     */
    @Transactional
    public CommentResponseDTO createComment(CommentRequestDTO dto) {
        log.info("createComment : {}", dto.getContent());
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. 대상 엔티티 조회 (ID가 있다면 조회, 없으면 null)
        Photo photo = getPhotoIfPresent(dto.getPhotoId());
        Exhibition exhibition = getExhibitionIfPresent(dto.getExhibitionId());

        // 3. 유효성 검증
        validateCommentTarget(photo, exhibition);

        Comment comment = Comment.builder()
                .user(user)
                .photo(photo)
                .exhibition(exhibition)
                .content(dto.getContent())
                .isDeleted(false)
                .build();

        return CommentResponseDTO.fromEntity(commentRepository.save(comment));
    }

    /**
     * 댓글 조회
     */
    @Transactional(readOnly = true)
    public List<CommentResponseDTO> getComment(Long photoId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new EntityNotFoundException("Photo not found"));

        return commentRepository
                .findByPhotoAndIsDeletedFalseOrderByCreatedAtDesc(photo)
                .stream()
                .map(CommentResponseDTO::fromEntity)
                .toList();

    }

    /**
     * 댓글 수정
     */
    @Transactional
    public CommentResponseDTO updateComment(Long commentId, CommentRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();


        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("본인만 수정 할 수 있습니다");
        }
        comment.updateComment(dto);
        return CommentResponseDTO.fromEntity(commentRepository.save(comment));
    }

    /**
     * 댓글 삭제
     */
    @Transactional
    public void deleteComment(Long commentId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("소유자만 삭제 할 수 있습니다");
        }

        comment.deleteComment();

    }


    /**
     * 유효성 검증
     */
    private Photo getPhotoIfPresent(Long photoId) {
        if (photoId == null) return null;
        return photoRepository.findById(photoId)
                .orElseThrow(() -> new EntityNotFoundException("Photo not found"));
    }

    private Exhibition getExhibitionIfPresent(Long exhibitionId) {
        if (exhibitionId == null) return null;
        return exhibitionRepository.findById(exhibitionId)
                .orElseThrow(() -> new EntityNotFoundException("Exhibition not found"));
    }

    private void validateCommentTarget(Photo photo, Exhibition exhibition) {
        if (photo == null && exhibition == null) {
            throw new IllegalArgumentException("댓글을 달 대상이 필요합니다");
        }
        if (photo != null && exhibition != null) {
            throw new IllegalArgumentException("댓글은 사진 또는 전시 중 하나의 대상에만 달 수 있습니다.");
        }
    }

}

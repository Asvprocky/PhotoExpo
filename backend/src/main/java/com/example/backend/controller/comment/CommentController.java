package com.example.backend.controller.comment;


import com.example.backend.dto.request.CommentRequestDTO;
import com.example.backend.dto.response.CommentResponseDTO;
import com.example.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/comment")
@RequiredArgsConstructor
@Slf4j
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/create")
    public ResponseEntity<CommentResponseDTO> createComment(@RequestBody CommentRequestDTO dto) {
        log.info("Controller invoked");
        CommentResponseDTO response = commentService.createComment(dto);
        log.info("Response : {}", response);
        return ResponseEntity.status(200).body(response);

    }

}

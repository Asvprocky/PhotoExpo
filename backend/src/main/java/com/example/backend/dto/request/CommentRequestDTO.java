package com.example.backend.dto.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequestDTO {
    @Nullable
    private Long exhibitionId;
    @Nullable
    private Long photoId;

    @NotBlank(message = "댓글 작성은 필수 입니다")
    private String content;


}

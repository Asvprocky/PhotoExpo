package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemsRequestDTO {
    // 구입한 photo id
    private Long photoId;
    // 구입 갯수
    private Integer quantity;
}

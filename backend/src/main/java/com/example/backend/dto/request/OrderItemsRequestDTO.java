package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemsRequestDTO {
    private Long photoId;
    private Integer quantity;
}

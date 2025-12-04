package com.example.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequestDTO {
    // 클라이언트가 주문 요청 시, 여러 사진 주문 정보를 한 번에 보낼 수 있도록 구성
    private List<OrderItemsRequestDTO> items;
}

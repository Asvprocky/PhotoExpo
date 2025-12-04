package com.example.backend.dto.response;

import com.example.backend.domain.Orders;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDTO(
        Long orderId,
        Long userId,
        String orderStatus,
        LocalDateTime createdAt,
        List<OrderItemsResponseDTO> items) {

    public static OrderResponseDTO fromEntity(Orders order) {
        List<OrderItemsResponseDTO> itemsDTO = order.getOrderItems().stream()
                .map(OrderItemsResponseDTO::fromEntity)
                .toList();

        return new OrderResponseDTO(
                order.getOrderId(),
                order.getUser().getUserId(),
                order.getOrderStatus().name(),
                order.getCreatedAt(),
                itemsDTO
        );
    }
}

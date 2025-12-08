package com.example.backend.dto.response;

import com.example.backend.domain.Orders;

import java.time.LocalDateTime;

/**
 * 전체 주문 조회
 *
 * @param orderId
 * @param orderStatus
 * @param totalPrice
 * @param createdAt
 */
public record OrderListResponseDTO(
        Long orderId,
        String orderStatus,
        Long totalPrice,
        LocalDateTime createdAt
) {

    public static OrderListResponseDTO fromEntity(Orders order) {
        return new OrderListResponseDTO(
                order.getOrderId(),
                order.getOrderStatus().name(),
                order.getTotalPrice(),
                order.getCreatedAt());

    }
}

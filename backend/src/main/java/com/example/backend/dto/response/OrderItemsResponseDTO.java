package com.example.backend.dto.response;

import com.example.backend.domain.OrderItems;

public record OrderItemsResponseDTO(
        Long orderItemId,
        Long photoId,
        String photoTitle,
        Integer quantity,
        Long price) {

    public static OrderItemsResponseDTO fromEntity(OrderItems orderItems) {
        return new OrderItemsResponseDTO(
                orderItems.getOrderItemsId(),
                orderItems.getPhoto().getPhotoId(),
                orderItems.getPhoto().getTitle(),
                orderItems.getQuantity(),
                orderItems.getPrice()
        );
    }
}

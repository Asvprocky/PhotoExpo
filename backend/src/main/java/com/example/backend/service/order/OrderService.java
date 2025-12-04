package com.example.backend.service.order;

import com.example.backend.domain.*;
import com.example.backend.dto.request.OrderRequestDTO;
import com.example.backend.dto.response.OrderResponseDTO;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.PhotoRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final UserRepository userRepository;
    private final PhotoRepository photoRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO dto) {

        // 1. 현재 로그인 유저 가져오기
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. 주문 생성 (비어있는 OrderItems 리스트 포함)
        Orders order = Orders.builder()
                .user(user)
                .orderStatus(OrderStatus.PENDING)
                .orderItems(new java.util.ArrayList<>())  // ⭐ 반드시 초기화
                .build();

        // 3. 주문 상품 생성 (OrderItems)
        List<OrderItems> items = dto.getItems().stream()
                .map(itemDTO -> {

                    Photo photo = photoRepository.findById(itemDTO.getPhotoId())
                            .orElseThrow(() -> new RuntimeException("Photo not found"));

                    // quantity + price(photo.price)
                    OrderItems orderItem = OrderItems.builder()
                            .orders(order)              // 연관관계 설정(주인)
                            .photo(photo)
                            .quantity(itemDTO.getQuantity())
                            .price(photo.getPrice())    // DB에 있는 사진 가격 자동 반영
                            .build();

                    order.getOrderItems().add(orderItem); // ⭐ Order에 추가
                    return orderItem;

                }).toList();

        // 4. Order 한 번만 저장 -> OrderItems 모두 cascade 로 저장됨
        orderRepository.save(order);

        // 5. Response DTO 변환
        return OrderResponseDTO.fromEntity(order);
    }
}
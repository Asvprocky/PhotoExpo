package com.example.backend.service.order;

import com.example.backend.domain.*;
import com.example.backend.dto.request.OrderItemsRequestDTO;
import com.example.backend.dto.request.OrderRequestDTO;
import com.example.backend.dto.response.OrderResponseDTO;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.PhotoRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final UserRepository userRepository;
    private final PhotoRepository photoRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO dto) {

        // 1. 유저 조회
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. 요청 들어온 사진 ID 리스트 추출
        List<Long> photoIds = dto.getItems().stream()
                .map(OrderItemsRequestDTO::getPhotoId)
                .toList();

        // 3. 사진 정보 한 번에 조회 (성능 최적화: 쿼리 1번)
        List<Photo> photos = photoRepository.findAllById(photoIds);

        // 빠른 조회를 위해 Map으로 변환 (Key: photoId, Value: Photo객체)
        Map<Long, Photo> photoMap = photos.stream()
                .collect(Collectors.toMap(Photo::getPhotoId, p -> p));

        // 4. 주문(Order) 객체 생성
        Orders order = Orders.builder()
                .user(user)
                .orderStatus(OrderStatus.PENDING)
                .orderItems(new ArrayList<>()) // 빈 리스트 초기화
                .build();

        long totalOrderPrice = 0L; // 총 금액 계산용

        // 5. 주문 아이템 생성 및 연결
        for (OrderItemsRequestDTO itemDTO : dto.getItems()) {
            Photo photo = photoMap.get(itemDTO.getPhotoId());

            if (photo == null) {
                throw new RuntimeException("존재하지 않는 사진 ID입니다: " + itemDTO.getPhotoId());
            }

            // 주문 아이템 생성 (가격은 DB의 Photo 가격 사용 -> 보안 강화)
            OrderItems orderItem = OrderItems.builder()
                    .orders(order)
                    .photo(photo)
                    .quantity(itemDTO.getQuantity())
                    .price(photo.getPrice())
                    .build();

            // 연관관계 설정
            order.getOrderItems().add(orderItem);

            // 총액 누적
            totalOrderPrice += (photo.getPrice() * itemDTO.getQuantity());
        }

        // 총 금액 저장
        order.setTotalPrice(totalOrderPrice);

        // 6. 저장 (Cascade로 인해 OrderItems도 자동 저장됨)
        orderRepository.save(order);

        return OrderResponseDTO.fromEntity(order);
    }
}
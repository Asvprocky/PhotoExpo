package com.example.backend.service.order;

import com.example.backend.domain.*;
import com.example.backend.dto.request.OrderItemsRequestDTO;
import com.example.backend.dto.request.OrderRequestDTO;
import com.example.backend.dto.response.OrderResponseDTO;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.PhotoRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final UserRepository userRepository;
    private final PhotoRepository photoRepository;
    private final OrderRepository orderRepository;

    /**
     * 사진 주문 메서드
     *
     * @param dto
     */
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
                .orderItems(new ArrayList<>()) // 빈 리스트 초기화 NPE 주의
                .build();

        long totalOrderPrice = 0L; // 총 금액 계산용

        // 5. 주문 아이템 하나씩 생성 및 연결
        for (OrderItemsRequestDTO itemDTO : dto.getItems()) {
            // photoId를 Key로 사용하여 Map에 저장된 Photo 객체 전체를 가져옴
            Photo photo = photoMap.get(itemDTO.getPhotoId());

            if (photo == null) {
                throw new RuntimeException("존재하지 않는 사진 ID입니다: " + itemDTO.getPhotoId());
            }

            // 주문 아이템 생성 (가격은 DB의 Photo 가격 사용 -> 보안 강화)
            OrderItems orderItem = OrderItems.builder()
                    .orders(order) // 연관간계 설정 1
                    .photo(photo)
                    .quantity(itemDTO.getQuantity())
                    .price(photo.getPrice())
                    .build();

            // 연관관계 설정 2, order에 orderItem 넣어주기
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

    /**
     * 내 주문 조회
     */
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getMyOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Orders> orders = orderRepository.findAllByUser(user);

        // ordersEntity -> OrderResponseDTO 로 사용자에게 필요한 값으로 변환

        return orders.stream()
                .map(OrderResponseDTO::fromEntity)
                .toList();


    }

    /**
     * 주문 취소
     */
    @Transactional
    public void cancelOrder(Long orderId) {
        // 1. 주문 엔티티 조회
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문입니다."));

        // 2. 현재 로그인 유저 및 권한 검증
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("email : {}", email);

        // 현재 주문의 소유자 이메일과 로그인 유저의 이메일이 일치하는지 확인
        if (!Objects.equals(order.getUser().getEmail(), email)) {
            throw new SecurityException("주문 취소 권한이 없습니다");

        }

        // 3. 비즈니스 상태 검증 (취소 가능 여부 체크)
        // 주문 상태가 'PENDING'일 때만 취소 가능하다고 가정.
        if (order.getOrderStatus() != OrderStatus.PENDING) {
            String status = order.getOrderStatus().name();
            throw new IllegalArgumentException("이미 처리된 주문입니다" + status);
        }

        // 4. 주문 상태 변경 및 저장
        order.cancel();
        orderRepository.save(order);


    }
}
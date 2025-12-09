package com.example.backend.controller.order;

import com.example.backend.dto.request.OrderRequestDTO;
import com.example.backend.dto.response.OrderListResponseDTO;
import com.example.backend.dto.response.OrderResponseDTO;
import com.example.backend.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/order")
public class OrderController {

    private final OrderService orderService;

    /**
     * 주문 생성
     */
    @PostMapping("/create")
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderRequestDTO dto) {
        OrderResponseDTO response = orderService.createOrder(dto);
        return ResponseEntity.status(200).body(response);
    }

    /**
     * 내 전체 주문 조회
     */
    @GetMapping("/my")
    public ResponseEntity<List<OrderListResponseDTO>> getMyOrder() {
        List<OrderListResponseDTO> orders = orderService.getMyOrders();
        return ResponseEntity.status(200).body(orders);

    }

    /**
     * 내 단일 주문 조회
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDTO> getOrderDetails(@PathVariable Long orderId) {
        OrderResponseDTO order = orderService.getOrderDetails(orderId);
        return ResponseEntity.status(200).body(order);
    }

    /**
     * 주문 삭제
     */
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
        log.info("cancel order : {}", orderId);
        orderService.cancelOrder(orderId);
        return ResponseEntity.status(204).build();
    }

}

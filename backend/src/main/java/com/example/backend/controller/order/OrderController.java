package com.example.backend.controller.order;

import com.example.backend.dto.request.OrderRequestDTO;
import com.example.backend.dto.response.OrderResponseDTO;
import com.example.backend.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/order")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderRequestDTO dto) {
        OrderResponseDTO response = orderService.createOrder(dto);
        return ResponseEntity.status(200).body(response);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
        log.info("cancel order : {}", orderId);
        orderService.cancelOrder(orderId);
        return ResponseEntity.status(204).build();
    }

}

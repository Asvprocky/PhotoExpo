package com.example.backend.controller.order;

import com.example.backend.dto.request.OrderRequestDTO;
import com.example.backend.dto.response.OrderResponseDTO;
import com.example.backend.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/order")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderRequestDTO dto) {
        OrderResponseDTO response = orderService.createOrder(dto);
        return ResponseEntity.status(200).body(response);
    }

}

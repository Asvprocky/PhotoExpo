package com.example.backend.repository;

import com.example.backend.domain.Orders;
import com.example.backend.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Orders, Long> {
    List<Orders> findAllByUser(Users user);


    @Query("SELECT o FROM Orders o JOIN FETCH o.orderItems oi JOIN FETCH oi.photo WHERE o.orderId = :orderId")
    Optional<Orders> findOrderDetailsWithItems(@Param("orderId") Long orderId);
}

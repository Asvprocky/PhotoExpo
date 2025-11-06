package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "jwt_refresh")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtRefresh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //  논리적으로만 관계가 있는 값
    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "refresh", nullable = false, length = 512)
    private String refresh;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}

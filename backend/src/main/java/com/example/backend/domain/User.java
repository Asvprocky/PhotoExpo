package com.example.backend.domain;

import com.example.backend.dto.UserRequestDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@EntityListeners({AuditingEntityListener.class})
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;


    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;


    @Column(name = "user_name", nullable = false, updatable = false)
    private String username;


    @Column(name = "nickname", nullable = false)
    private String nickname;


    @Column(name = "is_lock", nullable = false)
    private Boolean isLock;


    @Column(name = "is_social", nullable = false)
    private Boolean isSocial;


    @Enumerated(EnumType.STRING)
    @Column(name = "social_provider_type")
    private SocialProviderType socialProviderType;


    @Enumerated(EnumType.STRING)
    @Column(name = "role_type")
    private UserRoleType userRoleType;


    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;


    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    // 관계 매핑
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Photo> photos;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Exhibition> exhibitions;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Orders> orders;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<PhotoLikes> photoLikes;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<ExhibitionLikes> exhibitionLikes;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<SnsLinks> snsLinks;

    public void updateUser(UserRequestDTO dto) {
        this.email = dto.getEmail();
        this.username = dto.getUsername();
        this.nickname = dto.getNickname();
    }
}

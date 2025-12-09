package com.example.backend.domain;

import com.example.backend.dto.request.SnsLinkRequestDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Table(name = "sns_links")
public class SnsLinks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sns_id")
    private Long snsId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Enumerated(EnumType.STRING)
    @Column(name = "platform")
    private SnsLinkPlatform platform;

    @Column(name = "sns_url")
    private String snsUrl;

    public void updateLink(SnsLinkRequestDTO dto) {
        this.snsUrl = dto.getSnsUrl();
        this.platform = dto.getPlatform();
    }
}

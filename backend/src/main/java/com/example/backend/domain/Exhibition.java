package com.example.backend.domain;

import com.example.backend.dto.request.ExhibitionRequestDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Table(name = "exhibitions")
@EntityListeners(AuditingEntityListener.class)
public class Exhibition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exhibition_id")
    private Long exhibitionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users user;

    @Column(name = "title")
    private String title;

    @Column(name = "contents")
    private String contents;

    @Column(name = "template")
    private String template;

    @Column(name = "background")
    private String background;

    @Column(name = "layout")
    private String layout;

    @Column(name = "font_color")
    private String fontColor;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "exhibition_view_count")
    private Long exhibitionViewCount;


    @OneToMany(mappedBy = "exhibition",
            cascade = CascadeType.ALL,  // 💡 연관된 작업(삭제 포함)을 전파
            orphanRemoval = true,       // 💡 부모와의 연관이 끊기면 자식도 삭제
            fetch = FetchType.LAZY)
    private List<Photo> photos;

    /**
     * 수정 요청 메서드
     */
    public void updateExhibition(ExhibitionRequestDTO dto) {
        this.title = dto.getTitle();
        this.contents = dto.getContents();
        this.template = dto.getTemplate();
        this.background = dto.getBackground();
        this.layout = dto.getLayout();
        this.fontColor = dto.getFontColor();

    }

    /**
     * 조회수 증가
     */
    public void increaseViewCount() {
        this.exhibitionViewCount = this.exhibitionViewCount + 1;
    }


}

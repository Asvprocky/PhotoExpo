package com.example.backend.repository;

import com.example.backend.domain.Exhibition;
import com.example.backend.domain.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExhibitionRepository extends JpaRepository<Exhibition, Long> {
    List<Exhibition> findAllByOrderByCreatedAtDesc();

    List<Exhibition> findByUserOrderByCreatedAtDesc(Users user);

    // FETCH JOIN을 사용하여 사용자의 전시회와 사진을 한 번에 조회
    // DISTINCT를 사용하여 사진 개수만큼 전시회 데이터가 중복되는 것을 방지합니다.
    @Query("""
            SELECT DISTINCT e 
            FROM Exhibition e 
            LEFT JOIN FETCH e.photos 
            WHERE e.user = :user 
            ORDER BY e.createdAt DESC
            """)
    List<Exhibition> findByUserWithPhotosOrderByCreatedAtDesc(@Param("user") Users user);


    @Query("""
            SELECT e 
            FROM Exhibition e 
            LEFT JOIN FETCH e.photos 
            WHERE e.exhibitionId = :exhibitionId
            """)
    Optional<Exhibition> findByIdWithPhotos(@Param("exhibitionId") Long exhibitionId);

    /**
     * 유저 페이지 조회용
     *
     * @param userId
     * @return
     */
    List<Exhibition> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserUserId(Long userId);
}

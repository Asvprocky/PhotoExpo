# PhotoExpo

> **사진 기반 온라인 전시 및 판매 플랫폼**  
> 사용자가 사진을 업로드하고 템플릿 기반 전시를 구성하여  
> 감상, 소통, 구매까지 가능한 웹 서비스입니다.

---

## 프로젝트 개요

**PhotoExpo**는 사진 작가 및 일반 사용자가  
템플릿을 활용해 **독창적인 온라인 전시를 직접 구성**하고,  
다른 사용자는 전시와 사진을 감상하며  
**댓글, 좋아요, 주문(구매)** 까지 할 수 있는 플랫폼입니다.

백엔드는 **도메인 중심 설계**를 기반으로  
보안, 확장성, 데이터 무결성을 고려하여 구현되었습니다.

---

## 기술 스택

### Backend

- Java 17
- Spring Boot 3.5.6
- Spring Security (JWT)
- JPA / Hibernate
- MySQL 8.0
- Gradle

### Frontend

- Next.js (App Router) 15.5.4
- React
- TypeScript
- Tailwind CSS

---

## 프로젝트 구조 (Backend)
---

~~~
backend/
└── src/
└── main/
├── java/
│ └── com/example/backend/
│ ├── BackendApplication.java
│ │
│ ├── config/ # 공통 설정
│ │ ├── JpaConfig.java
│ │ ├── SecurityConfig.java
│ │ └── WebConfig.java
│ │
│ ├── security/ # 인증 / 인가
│ │ ├── jwt/
│ │ │ ├── JwtProvider.java
│ │ │ ├── JwtFilter.java
│ │ │ └── JwtAuthenticationEntryPoint.java
│ │ ├── CustomUserDetailsService.java
│ │ └── OAuth/
│ │
│ ├── domain/ # JPA Entity (도메인)
│ │ ├── Users.java
│ │ ├── Exhibitions.java
│ │ ├── Photos.java
│ │ ├── Comments.java
│ │ ├── Orders.java
│ │ ├── OrderItems.java
│ │ ├── PhotoLikes.java
│ │ ├── ExhibitionLikes.java
│ │ ├── SnsLinks.java
│ │ └── enums/
│ │ ├── OrderStatus.java
│ │ ├── UserRoleType.java
│ │ ├── SocialProviderType.java
│ │ └── SnsLinkPlatform.java
│ │
│ ├── dto/
│ │ ├── request/ # 요청 DTO (일반 클래스)
│ │ │ ├── UserRequestDTO.java
│ │ │ ├── ExhibitionRequestDTO.java
│ │ │ ├── PhotoRequestDTO.java
│ │ │ ├── CommentRequestDTO.java
│ │ │ ├── OrderRequestDTO.java
│ │ │ └── OrderItemsRequestDTO.java
│ │ │
│ │ └── response/ # 응답 DTO (record)
│ │ ├── UserResponseDTO.java
│ │ ├── ExhibitionResponseDTO.java
│ │ ├── PhotoResponseDTO.java
│ │ ├── CommentResponseDTO.java
│ │ ├── OrderResponseDTO.java
│ │ └── OrderItemsResponseDTO.java
│ │
│ ├── repository/ # JPA Repository
│ │ ├── UserRepository.java
│ │ ├── ExhibitionRepository.java
│ │ ├── PhotoRepository.java
│ │ ├── CommentRepository.java
│ │ ├── OrderRepository.java
│ │ ├── OrderItemsRepository.java
│ │ ├── PhotoLikesRepository.java
│ │ ├── ExhibitionLikesRepository.java
│ │ └── SnsLinksRepository.java
│ │
│ ├── service/ # 비즈니스 로직
│ │ ├── user/
│ │ │ └── UserService.java
│ │ ├── exhibition/
│ │ │ └── ExhibitionService.java
│ │ ├── photo/
│ │ │ └── PhotoService.java
│ │ ├── comment/
│ │ │ └── CommentService.java
│ │ ├── order/
│ │ │ └── OrderService.java
│ │ └── sns/
│ │ └── SnsLinkService.java
│ │
│ ├── controller/ # REST API
│ │ ├── AuthController.java
│ │ ├── UserController.java
│ │ ├── ExhibitionController.java
│ │ ├── PhotoController.java
│ │ ├── CommentController.java
│ │ ├── OrderController.java
│ │ └── SnsLinkController.java
│ │
│ └── exception/ # 예외 처리
│ ├── GlobalExceptionHandler.java
│ └── CustomException.java
│
└── resources/
├── application.yml
└── templates/ # 전시 템플릿 JSON
├── default.json
├── modern.json
└── art.json
~~~

---

## 인증 / 보안

- JWT 기반 인증 구조
- Access Token + Refresh Token 방식
- Refresh Token은 별도 테이블(`jwt_refresh`)에서 관리
- Spring Security `UserDetailsService` 직접 구현
- 일반 로그인 / 소셜 로그인 분리 처리

---

## 주요 기능 및 도메인 설계

### 사용자 (Users)

- 일반 회원 / 소셜 회원 구분
- 계정 잠금 상태 관리 (`is_lock`)
- Role 기반 권한 관리

---

### 전시 (Exhibitions)

- 사용자별 전시 생성 기능
- **템플릿 기반 전시 구성**
    - 레이아웃
    - 배경
    - 폰트
    - 색상 등
- 사용자가 템플릿을 조합하여 **독창적인 전시 페이지 구성**
- 전시 조회수 관리
- 전시 좋아요 기능

---

### 사진 (Photos)

- 전시에 속한 사진 관리
- 사진 단독 좋아요 기능
- 사진 가격 설정
- 사진 조회수 관리

---

### 댓글 (Comments)

- 전시 또는 사진에 댓글 작성
- 단일 대상 구조 (전시 또는 사진 중 하나만 참조)
- Soft Delete (`is_deleted`) 적용으로 데이터 보존

---

### 좋아요 (Likes)

- 전시 좋아요 / 사진 좋아요 분리 관리
- `(user_id + target_id)` 유니크 제약 조건 적용
- 좋아요 토글 방식 구현

---

### 주문 / 주문 상품 (Orders / OrderItems)

- 주문(Order)과 주문 상품(OrderItems) 분리 설계
- 주문은 여러 사진을 포함 가능
- **사진 가격은 DB 기준으로만 계산**
    - 클라이언트 입력값 신뢰하지 않음
- 총 주문 금액 서버 계산
- Cascade 저장 구조 적용

---

### SNS 링크 (SnsLinks)

- 사용자 SNS 링크 관리
- Enum 기반 플랫폼 관리
    - INSTAGRAM
    - TWITTER
    - WEBSITE

---

## DTO 설계 원칙

### Request DTO

- 일반 클래스 사용
- `toEntity()`를 통한 엔티티 변환
- 외부 입력값 검증 책임

### Response DTO

- Java `record` 사용
- `static fromEntity()` 방식으로 변환
- 응답 전용 객체로 책임 분리

---

## ERD 설계 특징

- User 중심의 명확한 연관관계
- 다대다 관계는 중간 테이블로 분리
- 댓글은 전시 또는 사진 중 하나만 참조하도록 설계
- 주문/주문상품 분리로 확장성 확보
- 좋아요 유니크 제약으로 중복 방지

---

## Frontend 구조 개요

- Next.js Server Component 기본 사용
- 이벤트/상호작용 영역만 `use client` 적용
- Nest.js 내장 Fetch 백엔드 API 통신
- JWT 기반 인증 처리

---

## 주요 구현 포인트

- JPA 연관관계 주인 명확화
- Cascade 전략 활용으로 일관성 유지
- N+1 문제 방지 (일괄 조회)
- Enum 활용으로 도메인 안정성 확보
- 서버 중심 가격 계산으로 보안 강화
- REST API 책임 분리

---

## 향후 개선 사항

- 결제 시스템(PG) 연동
- 관리자 페이지
- 전시/사진 통계 대시보드
- 검색 및 필터 기능 고도화
- 캐싱(Redis) 적용

---

## 담당 역할

- 백엔드 아키텍처 설계 및 구현
- ERD 설계 및 데이터베이스 모델링
- JWT 인증/인가 구조 구현
- 전시, 사진, 댓글, 좋아요, 주문 API 개발
- 프론트엔드 연동 API 설계

---

## 한 줄 요약

> **PhotoExpo는 템플릿 기반 전시 구성과 사진 판매 기능을 결합한  
확장성과 보안을 고려한 사진 전시 플랫폼입니다.**
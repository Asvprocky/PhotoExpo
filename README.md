# PhotoExpo - 온라인 사진 전시회 플랫폼

## 프로젝트 개요

PhotoExpo는 사진작가와 관람객을 연결하는 **온라인 사진 전시회 플랫폼**입니다.  
사진작가는 자신의 작품을 전시하고, 관람객은 다양한 전시를 관람하며 좋아요, 댓글 등으로 상호작용할 수 있습니다.

주요 목적:

- 사진작가에게 작품을 전시할 수 있는 온라인 공간 제공
- 관람객에게 다양한 전시 콘텐츠 제공
- 사용자 관리 및 안전한 인증 기능 제공

---

## 기술 스택

| 구분             | 기술                                                  |
|----------------|-----------------------------------------------------|
| Backend        | Java, Spring Boot, Spring Security, Spring Data JPA |
| Database       | MySQL                                               |
| Frontend       | React, JavaScript, Tailwind CSS                     |
| Authentication | OAuth2, JWT (Access / Refresh Token)                |
| File Storage   | AWS S3 (작품 이미지 저장)                                  |
| Deployment     | AWS EC2 (서버 배포)                                     |
| API            | RESTful API, JSON                                   |
| Dev Tools      | Lombok, Postman, IntelliJ IDEA                      |

---

## 주요 기능

### 1. 전시회 관리

- 사진작가는 전시회를 생성하고 작품 업로드 가능
- 전시회별 작품 목록 조회
- 작품별 상세 정보 조회

### 2. 사용자 관리

- 회원가입 / 로그인 (일반 / 소셜 OAuth2)
- JWT 기반 인증 및 권한(Role) 관리
- 본인/관리자만 전시회 및 작품 삭제 가능

### 3. 작품 상호작용

- 관람객은 작품에 좋아요 및 댓글 가능
- 작품 조회수 통계 제공
- 전시회별 인기 작품 확인 가능

### 4. 인증 및 보안

- OAuth2 소셜 로그인 지원
- JWT Access / Refresh Token 기반 인증
- Refresh Token Rotation 정책 적용
- SecurityContextHolder 기반 요청 스레드 인증 관리

### 5. 파일 및 배포

- 작품 이미지 업로드 및 저장: AWS S3
- 서버 배포: AWS EC2
- Stateless 서버 구조와 Refresh Token Rotation 적용으로 확장성 높은 인증 시스템 구현

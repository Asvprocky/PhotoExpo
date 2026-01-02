import React from "react";
import Link from "next/link"; // 1. Link 컴포넌트 임포트

// 백엔드 데이터 구조에 맞춘 타입 정의
interface Photo {
  photoId: number;
  imageUrl: string;
}

interface ExhibitionData {
  exhibitionId: number;
  title: string;
  userEmail: String;
  userId: number;
  photos?: Photo[];
}

export default async function Exhibition() {
  let exhibitions: ExhibitionData[] = [];
  let errorMsg = null;

  try {
    const res = await fetch("http://localhost:8080/exhibition/all", {
      cache: "no-store",
    });

    if (res.ok) {
      exhibitions = await res.json();
    } else {
      console.error("Failed to fetch data:", res.status);
      errorMsg = `데이터 로딩 실패 (${res.status})`;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    errorMsg = "서버에 연결할 수 없습니다.";
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        모든 전시 ({exhibitions.length}개)
      </h1>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {exhibitions.map((item) => {
        const photoList = item.photos || [];
        const hasPhoto = photoList.length > 0;
        const imageUrl = hasPhoto ? photoList[0].imageUrl : null;

        return (
          // 2. Link 컴포넌트로 감싸기
          // key는 가장 바깥 태그인 Link에 줘야 합니다.
          // href에 상세 페이지 경로를 지정합니다. (/exhibition/1, /exhibition/2 ...)
          <Link
            href={`/exhibition/${item.exhibitionId}`}
            key={item.exhibitionId}
            style={{ textDecoration: "none", color: "inherit" }} // 링크의 기본 밑줄/색상 제거 스타일
          >
            <div
              style={{
                borderBottom: "1px solid #ccc",
                padding: "20px 0",
                cursor: "pointer", // 마우스를 올렸을 때 클릭 가능하다는 표시
                transition: "background-color 0.2s",
              }}
              // hover 효과를 주려면 CSS 클래스나 styled-component가 좋지만, 인라인으로는 제한적임
            >
              <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>{item.title}</h2>
              <p style={{ color: "#666", marginBottom: "10px" }}>
                작성자: {item.userEmail || "알 수 없음"}
              </p>
              <p>전시회 번호 :{item.exhibitionId}</p>
              <p>유저 아이디:{item.userId}</p>

              {imageUrl ? (
                <div style={{ maxWidth: "300px" }}>
                  <img
                    src={imageUrl}
                    alt={item.title}
                    width="300"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    style={{ display: "block", objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "300px",
                    height: "200px",
                    background: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                  }}
                >
                  이미지 없음
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

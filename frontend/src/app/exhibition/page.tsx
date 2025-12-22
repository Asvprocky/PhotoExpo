import React from "react";

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
    // 1. 백엔드 데이터 요청
    const response = await fetch("http://localhost:8080/exhibition/all", {
      cache: "no-store",
    });

    if (response.ok) {
      exhibitions = await response.json();
    } else {
      console.error("Failed to fetch data:", response.status);
      errorMsg = `데이터 로딩 실패 (${response.status})`;
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
      {/* 괄호 안 (item) 부분은 배열에서 꺼낸 현재 요소를 담는 변수 이름*/}
      {exhibitions.map((item) => {
        // 2. 사진 데이터 확인

        const photoList = item.photos || [];
        const hasPhoto = photoList.length > 0;
        const imageUrl = hasPhoto ? photoList[0].imageUrl : null;

        return (
          <div
            key={item.exhibitionId}
            style={{ borderBottom: "1px solid #ccc", padding: "20px 0" }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>{item.title}</h2>
            <p style={{ color: "#666", marginBottom: "10px" }}>
              작성자: {item.userEmail || "알 수 없음"}
            </p>
            <p>전시회 번호 :{item.exhibitionId}</p>
            <p>유저 아이디:{item.userId}</p>

            {/* 3. 이미지 표시 */}
            {imageUrl ? (
              <div style={{ maxWidth: "300px" }}>
                {/* referrerPolicy="no-referrer": S3가 localhost 출처를 차단하지 않도록 설정
                    crossOrigin="anonymous": CORS 문제 방지
                 */}
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
        );
      })}
    </div>
  );
}

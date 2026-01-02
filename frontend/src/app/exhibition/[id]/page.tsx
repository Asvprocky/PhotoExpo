import React from "react";

// 1. 타입 정의 (사진 및 전시회 상세 정보)
interface Photo {
  photoId: number;
  imageUrl: string;
}

interface ExhibitionDetailData {
  exhibitionId: number; // 상세 페이지에서도 ID가 필요할 수 있음
  title: string;
  contents: string;
  userEmail: string;
  userId: number;
  exhibitionViewCount: number;
  photos?: Photo[]; // 사진 데이터 배열 (없을 수도 있음)
}

// 2. 컴포넌트 정의 (params로 id를 받음)
export default async function ExhibitionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data: ExhibitionDetailData | null = null;
  let errorMsg = null;

  try {
    // 3. 백엔드 데이터 요청
    const res = await fetch(`http://localhost:8080/exhibition/${id}`, {
      cache: "no-store", // 최신 데이터 유지를 위해 캐시 방지
    });

    if (res.ok) {
      const json = await res.json();
      // 백엔드 응답 구조에 따라 경로가 다를 수 있으니 console.log로 확인 권장
      // 예: json.data 혹은 json.data.exhibition 등
      data = json.data || json;
    } else {
      console.error("Failed to fetch detail:", res.status);
      errorMsg = `데이터를 불러올 수 없습니다. (${res.status})`;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    errorMsg = "서버와 연결할 수 없습니다.";
  }

  // 4. 에러 처리 UI
  if (errorMsg) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
        <h2>오류 발생</h2>
        <p>{errorMsg}</p>
      </div>
    );
  }

  // 5. 데이터가 없는 경우 (null check)
  if (!data) {
    return <div style={{ padding: "20px" }}>데이터가 없습니다.</div>;
  }

  // 6. 이미지 데이터 처리 로직 (리스트 뷰에서 가져옴)
  const photoList = data.photos || [];

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* 헤더 영역 */}
      <div style={{ borderBottom: "2px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "10px" }}>{data.title}</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#666",
            fontSize: "14px",
          }}
        >
          <span>
            작성자: {data.userEmail} (ID: {data.userId})
          </span>
          <span>
            조회수: {data.exhibitionViewCount} | No. {id}
          </span>
        </div>
      </div>

      {/* 본문 내용 영역 */}
      <div
        style={{ minHeight: "200px", fontSize: "16px", lineHeight: "1.6", marginBottom: "40px" }}
      >
        {data.contents}
      </div>

      {/* 이미지 표시 영역 */}
      <div>
        <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>전시 사진</h3>
        {photoList.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {photoList.map((photo) => (
              <div key={photo.photoId} style={{ border: "1px solid #eee", padding: "5px" }}>
                <img
                  src={photo.imageUrl}
                  alt={data?.title || "전시 이미지"}
                  width="400"
                  // S3 및 로컬호스트 이미지 정책 우회 설정
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  style={{ display: "block", maxWidth: "100%", height: "auto", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "150px",
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
              borderRadius: "8px",
            }}
          >
            등록된 이미지가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

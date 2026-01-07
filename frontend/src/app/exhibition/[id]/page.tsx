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

  // app/exhibition/[id]/page.tsx (내부 UI 부분 예시)
  return (
    <div className="bg-white min-h-screen">
      {/* 1. 상단 섹션 (어두운 배경 + 제목) */}
      <div className="bg-[#191919] text-white pt-24 pb-16 px-10 text-center">
        <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase">{data.title}</h1>
        <p className="text-gray-400 text-xs font-medium tracking-[0.3em] uppercase">
          Exhibition No. {id} | View {data.exhibitionViewCount}
        </p>
      </div>

      {/* 2. 작성자 및 상세 설명 섹션 */}
      <div className="max-w-4xl mx-auto px-10 py-16">
        <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-8">
          <div className="w-12 h-12 bg-gray-200 rounded-full" /> {/* 프로필 이미지 자리 */}
          <div>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Created by</p>
            <p className="text-lg font-black text-gray-900">{data.userEmail}</p>
          </div>
        </div>

        <div className="text-lg leading-relaxed text-gray-700 font-medium whitespace-pre-wrap">
          {data.contents}
        </div>
      </div>

      {/* 3. 이미지 리스트 섹션 (와이드하게 배치) */}
      <div className="flex flex-col gap-10 pb-20">
        {photoList.map((photo) => (
          <div key={photo.photoId} className="w-full bg-gray-50 flex justify-center">
            <img
              src={photo.imageUrl}
              alt="Exhibition Artwork"
              className="max-w-full h-auto shadow-lg"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

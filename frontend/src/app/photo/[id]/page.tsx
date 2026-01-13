import React from "react";
import Image from "next/image";

// 1. 타입 정의 (사진 상세 정보)
interface PhotoDetailData {
  photoId: number;
  imageUrl: string;
  title: string;
  description: string;
  userEmail: string;
  nickname: string;
  // 필요에 따라 추가 (예: uploadDate, tags 등)
}

export default async function PhotoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data: PhotoDetailData | null = null;
  let errorMsg = null;

  try {
    // 2. 백엔드 데이터 요청 (Spring Boot 서버 주소 확인)
    const res = await fetch(`http://localhost:8080/photo/${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      // 백엔드 응답이 json.data 안에 데이터가 들어오는 구조라면 json.data 사용
      data = json.data || json;
    } else {
      errorMsg = `사진을 불러올 수 없습니다. (${res.status})`;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    errorMsg = "서버와 연결할 수 없습니다.";
  }

  // 3. 에러 처리 UI
  if (errorMsg) {
    return (
      <div className="py-20 text-center text-red-500 font-bold">
        <h2>오류 발생</h2>
        <p>{errorMsg}</p>
      </div>
    );
  }

  // 4. 데이터 없는 경우
  if (!data) {
    return <div className="py-20 text-center font-bold">데이터가 존재하지 않습니다.</div>;
  }

  return (
    <div className="bg-white">
      {/* 이미지 영역: aspect-square 혹은 자연스러운 높이 조절 */}
      <div className="flex flex-col gap-10 pb-20">
        <div className="w-full bg-gray-50 flex justify-center">
          <img
            src={data.imageUrl}
            alt={data.title}
            className="max-w-full h-auto shadow-lg"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
          />
        </div>
      </div>
      {/* 정보 영역: ExhibitionDetail의 톤앤매너 유지 */}
      <div className="mt-12 max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
          <p className="text-lg font-black text-gray-900">{data.nickname || data.userEmail}</p>

          <div className="text-lg leading-relaxed text-gray-600 font-medium whitespace-pre-wrap">
            {data.description}
          </div>
        </div>
      </div>
    </div>
  );
}

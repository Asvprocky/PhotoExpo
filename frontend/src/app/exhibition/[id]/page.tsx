import React from "react";

// 타입 정의
interface Photo {
  photoId: number;
  imageUrl: string;
}

interface ExhibitionDetailData {
  exhibitionId: number;
  title: string;
  contents: string;
  userEmail: string;
  userId: number;
  exhibitionViewCount: number;
  photos?: Photo[];
}

export default async function ExhibitionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let data: ExhibitionDetailData | null = null;
  let errorMsg: string | null = null;

  try {
    const res = await fetch(`http://localhost:8080/exhibition/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      errorMsg = `데이터를 불러올 수 없습니다. (${res.status})`;
    } else {
      const json = await res.json();
      data = json.data || json;
    }
  } catch (e) {
    console.error(e);
    errorMsg = "서버와 연결할 수 없습니다.";
  }

  if (errorMsg) {
    return (
      <div className="py-20 text-center text-red-500 font-bold">
        <h2>오류 발생</h2>
        <p>{errorMsg}</p>
      </div>
    );
  }

  if (!data) {
    return <div className="py-20 text-center font-bold">데이터가 없습니다.</div>;
  }

  const photoList = data.photos ?? [];

  return (
    <div className="bg-white">
      {/* 1. 상단 헤더 */}
      <div className="bg-[#191919] text-white pt-24 pb-16 px-10 text-center">
        <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase">{data.title}</h1>
        <p className="text-gray-400 text-xs font-medium tracking-[0.3em] uppercase">
          Exhibition No. {id} | View {data.exhibitionViewCount}
        </p>
      </div>

      {/* 2. 설명 영역 */}
      <div className="max-w-4xl mx-auto px-10 py-16">
        <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-8">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Created by</p>
            <p className="text-lg font-black text-gray-900">{data.userEmail}</p>
          </div>
        </div>

        <div className="text-lg leading-relaxed text-gray-700 font-medium whitespace-pre-wrap">
          {data.contents}
        </div>
      </div>

      {/* 3. 이미지 리스트 */}
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

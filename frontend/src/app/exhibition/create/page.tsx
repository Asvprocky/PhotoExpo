"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/services/auth";

const BASE_URL = "http://localhost:8080";

export default function UnifiedUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isExhibitionMode, setIsExhibitionMode] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...fileArray]);
      const newPreviewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviewUrls]);
      e.target.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return alert("사진을 최소 1장 선택해주세요.");
    setLoading(true);

    try {
      let exhibitionId = null;
      if (isExhibitionMode) {
        const exhibitionRes = await authFetch(`${BASE_URL}/exhibition/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, contents: desc, template: "default" }),
        });
        if (!exhibitionRes.ok) throw new Error("전시회 생성 실패");
        const exhibitionData = await exhibitionRes.json();
        exhibitionId = exhibitionData.exhibitionId;
      }

      const formData = new FormData();
      const photoDto = JSON.stringify({ exhibitionId, title, description: desc });
      formData.append("dto", new Blob([photoDto], { type: "application/json" }));
      selectedFiles.forEach((file) => formData.append("image", file));

      const photoRes = await authFetch(`${BASE_URL}/photo/upload`, {
        method: "POST",
        body: formData,
      });
      if (!photoRes.ok) throw new Error("사진 업로드 실패");

      alert(isExhibitionMode ? "전시회가 개최되었습니다!" : "사진 업로드가 완료되었습니다!");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[100px] pb-20 min-h-screen bg-gray-100 font-bold">
      <div className="max-w-[1400px] mx-auto px-6 flex md:flex-col lg:flex-row gap-8">
        {/* --- 왼쪽 영역: 이미지 원본 비율 유지 --- */}
        <div className="flex-1 bg-white rounded-none border border-gray-200 shadow-sm min-h-[700px] flex flex-col relative">
          {previews.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
              <svg
                className="mx-auto h-24 w-24 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-bold text-gray-500">미리보기 영역 (비어 있음)</h3>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col overflow-y-auto bg-gray-100 gap-0">
              {previews.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative group w-full flex justify-center items-center bg-white border-b border-gray-200 last:border-b-0 py-0"
                >
                  <img
                    src={url}
                    alt={`preview-${idx}`}
                    className="w-auto h-auto max-w-full rounded-none shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="absolute top-0 right-0 bg-black/60 hover:bg-red-600 text-white w-10 h-10 flex items-center justify-center text-lg font-bold transition-all opacity-0 group-hover:opacity-100 rounded-none z-10"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- 오른쪽 사이드바 --- */}
        <div className="w-full lg:w-[300px] bg-white rounded-none border border-gray-200 shadow-sm p-6 h-fit sticky top-[100px]">
          <h1 className="text-xl font-black text-gray-900 mb-6">
            {isExhibitionMode ? "전시회 생성" : "사진 업로드"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-black text-gray-700 mb-2">
                사진 첨부 <span className="text-blue-600 ml-1">({selectedFiles.length})</span>
              </label>
              <div
                className={`flex items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-none bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer`}
                onClick={handleButtonClick}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-none flex items-center justify-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-gray-600">파일 추가</span>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group p-3 border border-gray-100 rounded-none hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={isExhibitionMode}
                onChange={(e) => setIsExhibitionMode(e.target.checked)}
                className="w-5 h-5 rounded-none border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors leading-none mt-0.5">
                전시회 만들기
              </span>
            </label>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-none focus:border-blue-600 outline-none font-bold transition-all text-gray-700 text-sm"
                  placeholder="제목 입력"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2">설명</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-none focus:border-blue-600 outline-none font-bold transition-all text-gray-700 text-sm min-h-[120px] resize-none"
                  placeholder="설명 입력"
                />
              </div>
            </div>

            {/* --- 확인 버튼 --- */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-lg font-black text-white shadow-md transition-all active:scale-95 mt-4 ${
                isExhibitionMode ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-900 hover:bg-black"
              }`}
            >
              {loading ? "처리 중..." : "생성"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

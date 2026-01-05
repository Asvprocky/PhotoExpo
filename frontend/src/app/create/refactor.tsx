"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/services/auth";

const BASE_URL = "http://localhost:8080";

export default function UnifiedUploadPage() {
  const router = useRouter();

  // 1. 상태 관리 (설명글을 'desc' 하나로 통합하여 혼동을 방지합니다)
  const [isExhibitionMode, setIsExhibitionMode] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState(""); // 전시회 contents와 사진 description을 하나로 합침
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 2. 이미지 선택 및 미리보기 로직
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      previews.forEach((url) => URL.revokeObjectURL(url));
      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviews(previewUrls);
    }
  };

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  // 3. 통합 제출 로직 (하나의 흐름으로 합침)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return alert("사진을 최소 1장 선택해주세요.");

    setLoading(true);

    try {
      let exhibitionId = null;

      // [STEP 1] 전시회 모드일 경우 전시회 먼저 생성 (JSON 전송)
      if (isExhibitionMode) {
        const exhibitionRes = await authFetch(`${BASE_URL}/exhibition/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            contents: desc,
            template: "default",
          }),
        });

        if (!exhibitionRes.ok) throw new Error("전시회 생성 실패");
        const exhibitionData = await exhibitionRes.json();
        exhibitionId = exhibitionData.exhibitionId; // 생성된 ID 확보
      }

      // [STEP 2] 사진 업로드 (Multipart 전송)
      const formData = new FormData();
      const photoDto = JSON.stringify({
        exhibitionId, // 전시회 모드면 ID가 있고, 일반 모드면 null
        title,
        description: desc,
      });

      // Spring @RequestPart 대응을 위한 Blob 포장
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
      console.error("Upload Error:", error);
      alert("등록 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>{isExhibitionMode ? "전시회 개최" : "사진 업로드"}</h1>

      <form onSubmit={handleSubmit}>
        {/* 사진 선택 (공통) */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <label style={{ fontWeight: "bold" }}>사진 선택 ({selectedFiles.length}장)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "block", marginTop: "10px" }}
          />

          <div style={{ marginTop: "20px" }}>
            <label
              style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#007bff" }}
            >
              <input
                type="checkbox"
                checked={isExhibitionMode}
                onChange={(e) => setIsExhibitionMode(e.target.checked)}
                style={{ marginRight: "8px", width: "18px", height: "18px" }}
              />
              이 사진들로 전시회 만들기
            </label>
          </div>
        </div>

        {/* 입력 정보 (공통) */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold" }}>
              {isExhibitionMode ? "전시회 제목" : "사진 제목"}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              required
            />
          </div>
          <div>
            <label style={{ fontWeight: "bold" }}>
              {isExhibitionMode ? "전시회 설명" : "사진 설명"}
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                height: "100px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              required
            />
          </div>
        </div>

        {/* 미리보기 */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "30px" }}>
          {previews.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt="미리보기"
              style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background: isExhibitionMode ? "#007bff" : "#333",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {loading ? "처리 중..." : isExhibitionMode ? "전시회 등록하기" : "사진 업로드하기"}
        </button>
      </form>
    </div>
  );
}

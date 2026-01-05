"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/services/auth";

const BASE_URL = "http://localhost:8080";

export default function UnifiedUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. 상태 관리 (설명글을 'desc' 하나로 통함)
  const [isExhibitionMode, setIsExhibitionMode] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState(""); // 전시회 contents와 사진 description을 하나로 합침
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 버튼을 누르면 숨겨진 input이 클릭되게 만드는 함수
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 2. 이미지 선택 및 미리보기 로직
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);

      // 1. 기존 파일 배열 뒤에 새로 선택한 파일들을 합침.
      setSelectedFiles((prev) => [...prev, ...fileArray]);

      // 2. 새로 선택된 파일들에 대해서만 미리보기 URL을 생성.
      const newPreviewUrls = fileArray.map((file) => URL.createObjectURL(file));

      // 3. 기존 미리보기 URL 배열 뒤에 새로운 URL들을 합침.
      // 주의: 기존 URL들을 revokeObjectURL로 지우면 안됨! (화면에서 사라짐)
      setPreviews((prev) => [...prev, ...newPreviewUrls]);

      // 4. (중요) 같은 파일을 다시 선택해도 이벤트가 발생하도록 input 값을 초기화.
      e.target.value = "";
    }
  };

  // --- [추가] 특정 사진 삭제 함수 ---
  const handleRemoveFile = (index: number) => {
    // 1. 메모리 해제: 삭제할 URL을 브라우저 메모리에서 제거.
    URL.revokeObjectURL(previews[index]);

    // 2. 파일 배열에서 해당 인덱스 제외
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);

    // 3. 미리보기 배열에서 해당 인덱스 제외
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
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
      let exhibitionId = null; // exhibitionId 기본값 null

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
      const formData = new FormData(); // 이미지 파일 과 JSON 함깨 전송시 FormData 객체 사용
      const photoDto = JSON.stringify({
        exhibitionId, // 전시회면 ID가 있고, 사진만 업로드 모드면 null
        title,
        description: desc,
      });

      // JSON + 파일 혼합 전송 패턴, Spring @RequestPart 대응을 위한 Blob 포장 (), 패턴: formData.append("이름", 데이터)
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
      alert("등록 중 오류가 발생했습니다.");
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
            border: "1px solid #eee",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            backgroundColor: "#fff",
          }}
        >
          {/* 레이블과 버튼을 한 줄에 배치하여 미니멀하게 구성 */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
            <label style={{ fontWeight: "600", fontSize: "14px", color: "#333" }}>
              사진 첨부{" "}
              <span style={{ color: "#888", fontWeight: "400", fontSize: "12px" }}>
                ({selectedFiles.length}장)
              </span>
            </label>
            {/* 실제 input은 숨기고 */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />

            {/* 미니멀한 커스텀 버튼 */}
            <button
              type="button"
              onClick={handleButtonClick}
              style={{
                padding: "5px 12px",
                backgroundColor: "#fff",
                border: "1px solid #e1e1e1",
                color: "#666",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "500",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#bbb";
                e.currentTarget.style.color = "#333";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#e1e1e1";
                e.currentTarget.style.color = "#666";
              }}
            >
              파일 선택
            </button>
          </div>

          {/* 체크박스 영역 */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontSize: "13px",
              color: "#007bff",
            }}
          >
            <input
              type="checkbox"
              checked={isExhibitionMode}
              onChange={(e) => setIsExhibitionMode(e.target.checked)}
              style={{ marginRight: "6px", width: "16px", height: "16px" }}
            />
            이 사진들로 전시회 만들기
          </label>
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
        {/* 미리보기 (삭제 버튼 추가) */}
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "30px" }}>
          {previews.map((url, idx) => (
            <div key={idx} style={{ position: "relative", width: "80px", height: "80px" }}>
              <img
                src={url}
                alt="미리보기"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }}
              />
              {/* 삭제 버튼 (X) */}
              <button
                type="button"
                onClick={() => handleRemoveFile(idx)}
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  backgroundColor: "#ff4d4f",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                ✕
              </button>
            </div>
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

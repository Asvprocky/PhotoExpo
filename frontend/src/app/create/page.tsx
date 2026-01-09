"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/services/auth";
import { TEMPLATE_CONFIG } from "../constants/templates";

const BASE_URL = "http://localhost:8080";

/* ==============================
 * 외부 컴포넌트: 개별 설명 블록
 * ============================== */
const DescriptionBlock = ({ index, subIndex, data, onUpdate, onRemove, currentStyle }: any) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [data.text]);

  return (
    <div
      className={`w-full py-6 px-10 group/desc relative ${data.align} animate-in slide-in-from-top-2 duration-500`}
    >
      <textarea
        ref={textareaRef}
        value={data.text}
        onChange={(e) => onUpdate(index, subIndex, { ...data, text: e.target.value })}
        placeholder="내용을 입력하세요..."
        className={`w-full bg-transparent resize-none outline-none border-none transition-all placeholder:text-gray-400/50 
          ${currentStyle.font} ${currentStyle.fontColor} ${data.align}
          text-lg md:text-xl leading-relaxed min-h-[40px] focus:ring-0`}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover/desc:opacity-100 transition-all bg-black/80 p-1.5 rounded-full border border-white/20 z-20">
        <button
          type="button"
          onClick={() => onUpdate(index, subIndex, { ...data, align: "text-left" })}
          className={`px-2 text-[10px] ${
            data.align === "text-left" ? "text-blue-400" : "text-white"
          }`}
        >
          L
        </button>
        <button
          type="button"
          onClick={() => onUpdate(index, subIndex, { ...data, align: "text-center" })}
          className={`px-2 text-[10px] ${
            data.align === "text-center" ? "text-blue-400" : "text-white"
          }`}
        >
          C
        </button>
        <button
          type="button"
          onClick={() => onUpdate(index, subIndex, { ...data, align: "text-right" })}
          className={`px-2 text-[10px] ${
            data.align === "text-right" ? "text-blue-400" : "text-white"
          }`}
        >
          R
        </button>
        <div className="w-[1px] h-3 bg-white/20 self-center mx-1" />
        <button
          type="button"
          onClick={() => onRemove(index, subIndex)}
          className="px-2 text-[10px] text-red-400 font-bold"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

const InsertZone = ({ index, onAddText, onAddPhoto }: any) => {
  return (
    <div className="w-full px-10 py-2">
      <div className="w-full h-10 border border-dashed border-gray-200 rounded-lg flex items-center justify-center transition-all group overflow-hidden">
        <button
          type="button"
          onClick={() => onAddText(index)}
          className="flex-1 h-full flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors group/btn"
        >
          <span className="text-[11px] font-black text-gray-400 group-hover/btn:text-blue-600 uppercase tracking-tighter">
            + Text
          </span>
        </button>
        <div className="w-[1px] h-4 bg-gray-100" />
        <button
          type="button"
          onClick={() => onAddPhoto(index)}
          className="flex-1 h-full flex items-center justify-center gap-2 hover:bg-green-50 transition-colors group/btn"
        >
          <span className="text-[11px] font-black text-gray-400 group-hover/btn:text-green-600 uppercase tracking-tighter">
            + Photo
          </span>
        </button>
      </div>
    </div>
  );
};

export default function UnifiedUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const insertTargetRef = useRef<number | null>(null);

  const [isExhibitionMode, setIsExhibitionMode] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [template, setTemplate] = useState<string>("default");
  const [loading, setLoading] = useState(false);
  const [descMap, setDescMap] = useState<Record<number, { text: string; align: string }[]>>({});

  const currentStyle = TEMPLATE_CONFIG[template] || TEMPLATE_CONFIG.default;

  const handlePhotoAddClick = (index: number) => {
    insertTargetRef.current = index;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const newPreviewUrls = fileArray.map((f) => URL.createObjectURL(f));
    const targetIdx = insertTargetRef.current;

    if (targetIdx !== null) {
      setSelectedFiles((prev) => {
        const next = [...prev];
        next.splice(targetIdx, 0, ...fileArray);
        return next;
      });
      setPreviews((prev) => {
        const next = [...prev];
        next.splice(targetIdx, 0, ...newPreviewUrls);
        return next;
      });

      setDescMap((prev) => {
        const newMap: any = {};
        const moveCount = fileArray.length;
        Object.entries(prev).forEach(([key, val]) => {
          const k = parseInt(key);
          if (k > targetIdx) newMap[k + moveCount] = val;
          else newMap[k] = val;
        });
        return newMap;
      });
    } else {
      setSelectedFiles((prev) => [...prev, ...fileArray]);
      setPreviews((prev) => [...prev, ...newPreviewUrls]);
    }

    insertTargetRef.current = null;
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);

    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));

    setDescMap((prev) => {
      const newMap: Record<number, any[]> = {};

      const upperTexts = prev[index] || [];
      const lowerTexts = prev[index + 1] || [];

      // 핵심: 아래 텍스트를 위로 병합
      if (upperTexts.length || lowerTexts.length) {
        newMap[index] = [...upperTexts, ...lowerTexts];
      }

      Object.entries(prev).forEach(([key, val]) => {
        const k = Number(key);
        if (k < index) {
          newMap[k] = val;
        } else if (k > index + 1) {
          newMap[k - 1] = val;
        }
      });

      return newMap;
    });
  };

  const addDescription = (index: number) => {
    setDescMap((prev) => {
      const currentList = Array.isArray(prev[index]) ? prev[index] : [];
      return { ...prev, [index]: [{ text: "", align: "text-center" }, ...currentList] };
    });
  };

  const updateDescription = (index: number, subIndex: number, newData: any) => {
    setDescMap((prev) => {
      const newList = [...(prev[index] || [])];
      newList[subIndex] = newData;
      return { ...prev, [index]: newList };
    });
  };

  const removeDescription = (index: number, subIndex: number) => {
    setDescMap((prev) => {
      const newList = (prev[index] || []).filter((_, i) => i !== subIndex);
      const nextMap = { ...prev };
      if (newList.length === 0) delete nextMap[index];
      else nextMap[index] = newList;
      return nextMap;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return alert("사진을 추가해주세요.");

    setLoading(true);
    try {
      let exhibitionId = null;

      // 1. 모든 텍스트 데이터를 JSON 문자열로 변환 (상세 페이지 재현용)
      const allContents = JSON.stringify(descMap);

      // 2. 전시회 모드일 경우 전시회 먼저 생성하여 ID 확보
      if (isExhibitionMode) {
        const exhibitionRes = await authFetch(`${BASE_URL}/exhibition/create`, {
          method: "POST",
          body: JSON.stringify({ title, contents: allContents, template }),
        });

        if (!exhibitionRes.ok) throw new Error("전시회 생성 실패");

        const data = await exhibitionRes.json();
        exhibitionId = data.exhibitionId;
      }

      // 3. 사진 업로드를 위한 FormData 준비
      const formData = new FormData();

      // 현재 descMap이 { 인덱스: [{text, align}, ...] } 구조이므로 모든 텍스트를 합침
      const combinedDesc = Object.values(descMap)
        .flatMap((list) => list.map((v) => v.text))
        .join("\n");

      const photoDto = JSON.stringify({
        exhibitionId,
        title,
        description: combinedDesc,
      });

      // DTO와 파일들을 FormData에 추가
      formData.append("dto", new Blob([photoDto], { type: "application/json" }));
      selectedFiles.forEach((file) => formData.append("image", file));

      // 4. 실제 사진 업로드 요청 (이 부분이 빠져있었습니다!)
      const photoRes = await authFetch(`${BASE_URL}/photo/upload`, {
        method: "POST",
        body: formData,
      });

      if (!photoRes.ok) throw new Error("사진 업로드 실패");

      alert("전시회가 성공적으로 개최되었습니다!");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("등록 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="pt-5 pb-20 min-h-screen bg-gray-100 font-bold">
      <div className="max-w-[1400px] mx-auto px-6 flex md:flex-col lg:flex-row gap-8">
        {/* --- 왼쪽 영역 --- */}
        <div
          className={`flex-1 rounded-none border border-gray-200 shadow-sm min-h-[700px] flex flex-col relative transition-all duration-500 overflow-hidden ${currentStyle.container}`}
        >
          <div
            className={`w-full h-full overflow-y-auto custom-scrollbar transition-all duration-500 ${currentStyle.padding}`}
          >
            <InsertZone index={0} onAddText={addDescription} onAddPhoto={handlePhotoAddClick} />
            {Array.isArray(descMap[0]) &&
              descMap[0].map((data, subIdx) => (
                <DescriptionBlock
                  key={`0-${subIdx}`}
                  index={0}
                  subIndex={subIdx}
                  data={data}
                  onUpdate={updateDescription}
                  onRemove={removeDescription}
                  currentStyle={currentStyle}
                />
              ))}

            {previews.map((url, idx) => (
              <div key={`${url}-${idx}`} className="flex flex-col items-center">
                <div className="relative group w-full flex justify-center items-center px-10">
                  <img
                    src={url}
                    alt="p"
                    className={`transition-all duration-700 shadow-md ${currentStyle.imageLayout}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="absolute top-4 right-14 bg-black/70 hover:bg-red-600 text-white w-10 h-10 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    ✕
                  </button>
                </div>
                <InsertZone
                  index={idx + 1}
                  onAddText={addDescription}
                  onAddPhoto={handlePhotoAddClick}
                />
                {Array.isArray(descMap[idx + 1]) &&
                  descMap[idx + 1].map((data, subIdx) => (
                    <DescriptionBlock
                      key={`${idx + 1}-${subIdx}`}
                      index={idx + 1}
                      subIndex={subIdx}
                      data={data}
                      onUpdate={updateDescription}
                      onRemove={removeDescription}
                      currentStyle={currentStyle}
                    />
                  ))}
              </div>
            ))}
            <div className="h-40" />
          </div>
        </div>

        {/* --- 오른쪽 사이드바 --- */}
        <div className="w-full lg:w-[320px] bg-white border border-gray-200 p-6 h-fit sticky top-20">
          <h1 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tighter italic">
            Curation
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* input을 div 밖으로 완전히 뺐음 (이벤트 버블링 차단) */}
            <div
              onClick={() => {
                insertTargetRef.current = null;
                fileInputRef.current?.click();
              }}
              className="p-4 border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer text-center"
            >
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                + Bulk Upload
              </span>
            </div>

            {/* 인풋은 div 바깥에 두어 부모의 onClick을 방해하지 않음 */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />

            <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 transition-all">
              <input
                type="checkbox"
                checked={isExhibitionMode}
                onChange={(e) => setIsExhibitionMode(e.target.checked)}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="text-sm font-bold">전시회 생성 모드</span>
            </label>

            {isExhibitionMode && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                {["default", "classic"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTemplate(t)}
                    className={`py-3 text-[10px] font-black border-2 transition-all uppercase ${
                      template === t
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-100 text-gray-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border-2 border-gray-100 focus:border-blue-600 outline-none text-sm font-bold"
                placeholder="EXHIBITION TITLE"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white text-xs font-black hover:bg-blue-700 transition-all uppercase tracking-widest"
            >
              Publish Exhibition
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

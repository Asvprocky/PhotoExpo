// components/Modal.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface ModalProps {
  children: React.ReactNode;
  title?: string;
  nickname?: string;
  user?: {
    nickname: string;
    email: string;
  };
}

export default function Modal({ children, title, user }: ModalProps) {
  const router = useRouter();
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const onDismiss = () => router.back();

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-0" // 배경 더 어둡게
      onClick={(e) => e.target === overlay.current && onDismiss()}
    >
      {/* --- [왼쪽 상단] 포토그래퍼 & 제목 정보 --- */}
      {(title || user?.nickname) && (
        <div className="fixed top-8 left-10 z-[70] text-white flex items-center gap-4 pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-gray-500 border border-white/20 overflow-hidden">
            {/* 프로필 이미지 들어갈 자리 */}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-black">{title}</span>
            </div>
            <p className="text-[11px] font-medium text-gray-400">{user?.nickname} • </p>
          </div>
        </div>
      )}

      {/* --- [우측 상단] 닫기 버튼 --- */}
      <button
        onClick={onDismiss}
        className="fixed top-8 right-10 z-[70] text-white/50 hover:text-white transition-colors"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* --- [중앙 콘텐츠] 배경색 없이 내용만 배치 --- */}
      <div className="w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center">
        <div className="w-full max-w-7xl py-24 px-10">{children}</div>
      </div>
    </div>
  );
}

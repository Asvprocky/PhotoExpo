// components/Modal.tsx 수정본
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const overlay = useRef(null);

  useEffect(() => {
    // 모달이 열릴 때 스크롤 잠금
    document.body.style.overflow = "hidden";
    return () => {
      // 모달이 닫힐 때 스크롤 복원
      document.body.style.overflow = "auto";
    };
  }, []);

  const onDismiss = () => router.back();

  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 md:p-10 backdrop-blur-[2px]"
      onClick={(e) => e.target === overlay.current && onDismiss()}
    >
      <div className="relative w-full max-w-6xl max-h-full overflow-y-auto bg-white rounded-2xl shadow-2xl custom-scrollbar">
        {/* 우측 상단 고정 닫기 버튼 */}
        <button
          onClick={onDismiss}
          className="fixed top-6 right-6 z-[70] p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

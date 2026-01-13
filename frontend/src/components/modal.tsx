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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-0"
      onClick={(e) => e.target === overlay.current && onDismiss()}
    >
      {/* --- [우측 상단] 닫기 버튼: 이건 고정(fixed)되어야 언제든 끌 수 있습니다 --- */}
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

      {/* --- [스크롤 컨테이너] --- */}
      <div className="w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center">
        {/* 프로필 정보를 스크롤 영역 안쪽 최상단에 배치합니다 */}
        <div className="w-full max-w-7xl relative">
          {(title || user?.nickname) && (
            /* fixed를 제거하고 absolute 또는 상대적 위치를 사용 */
            <div className="absolute top-6 left-2 z-[70] text-white flex items-center gap-4 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-gray-500 border border-white/20 overflow-hidden">
                {/* 프로필 이미지 들어갈 자리 */}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-black">{title}</span>
                </div>
                <p className="text-[11px] font-medium text-gray-400">{user?.nickname}</p>
              </div>
            </div>
          )}

          {/* 실제 콘텐츠 (전시 상세 내용) */}
          <div className="w-full py-22 px-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

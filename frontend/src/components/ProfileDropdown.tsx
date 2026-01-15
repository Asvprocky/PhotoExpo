"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ProfileDropdown() {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  return (
    <div className="relative group flex items-center overflow-visible">
      {/* --- 프로필 아이콘: 테두리를 없애고 더 깔끔하게 --- */}
      <div className="cursor-pointer p-1 z-[101] transition-transform active:scale-95">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-black/5 shadow-sm">
          <Image
            src="/photoExpo_Profile_Image.jpg"
            alt="Profile"
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
      </div>

      {/* --- 드롭다운 메뉴: 아트 라벨 스타일 --- */}
      <div className="absolute right-0 top-[48px] w-60 bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-2xl invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-[100] overflow-hidden">
        {/* 유저 정보 섹션: 배경색 없이 텍스트 위주로 */}
        <div className="pt-6 pb-4 px-6 border-b border-gray-50">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
            Account
          </p>
          <h3 className="text-sm font-black text-gray-900 leading-tight">Jason Lee</h3>
        </div>

        {/* 메뉴 리스트 */}
        <div className="py-2">
          <Link
            href="/user/info"
            className="group/item flex items-center justify-between px-6 py-3 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
          >
            <span>프로필 관리</span>
            <span className="opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0">
              →
            </span>
          </Link>
          <Link
            href="/settings"
            className="group/item flex items-center justify-between px-6 py-3 text-xs font-bold text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
          >
            <span>설정</span>
            <span className="opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0">
              →
            </span>
          </Link>

          <div className="h-[1px] bg-gray-50 my-1 mx-6"></div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-6 py-4 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <span>로그아웃</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

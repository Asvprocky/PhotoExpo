"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // 경로 감지용
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 현재 페이지가 마이페이지인지 확인
  const isMyPage = pathname === "/user/info";

  useEffect(() => {
    // 스크롤 감지 로직
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-10 h-14 transition-all duration-300 ${
        isMyPage && !isScrolled
          ? "bg-transparent border-none shadow-none" // 마이페이지일 때: 투명
          : "bg-white border-b border-gray-100 shadow-sm" // 일반 페이지: 흰색 배경
      }`}
    >
      {/* --- 1. 왼쪽 영역 (로고만 남김) --- */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/PhotoExpoLogo2.png"
            alt="Logo"
            width={144}
            height={30}
            priority
            className={isMyPage ? "brightness-0 invert" : ""}
          />
        </Link>
      </div>

      {/* --- 2. 중앙 영역 (추가됨) --- */}
      <div
        className={`absolute left-1/2 transform -translate-x-1/2 flex gap-8 text-base font-bold tracking-tight transition-colors ${
          isMyPage ? "text-white" : "text-gray-700"
        }`}
      >
        <Link href="/exhibition" className="hover:opacity-70">
          Exhibition
        </Link>
        {/* 나중에 메뉴 추가시 자동으로 중앙 정렬됨 */}
      </div>
      {/* --- 오른쪽 영역 --- */}
      <div className="flex items-center">
        {mounted && (
          <>
            {!isLoggedIn ? (
              <Link
                href="/login"
                className={`flex items-center justify-center px-8 h-10 border-2 rounded-full transition-all font-black ${
                  isMyPage
                    ? "text-white border-white hover:bg-white/10"
                    : "text-blue-600 border-blue-600 hover:bg-blue-50"
                }`}
              >
                로그인
              </Link>
            ) : (
              // 프로필 드롭다운 컴포넌트 내부의 텍스트 색상도 필요시 조절
              <ProfileDropdown />
            )}
          </>
        )}
      </div>
    </nav>
  );
}

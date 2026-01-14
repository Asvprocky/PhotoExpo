"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 1. 투명화가 적용될 페이지 조건 (마이페이지)
  const isMyPage = pathname.startsWith("/user/info");

  useEffect(() => {
    // 1 클라이언트 마운트 완료
    setMounted(true);

    // 2 로그인 상태 즉시 확인
    setIsLoggedIn(!!localStorage.getItem("accessToken"));

    // 3 중요: 현재 스크롤 위치 즉시 반영
    setIsScrolled(window.scrollY > 50);

    // 4 스크롤 이벤트 리스너
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    // 5 클린업
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // 하이드레이션 에러 방지 (클라이언트 마운트 전에는 렌더링하지 않음)
  if (!mounted) return null;

  // 2. 최종 투명 여부 결정: 마이페이지이면서 + 스크롤이 위쪽에 있을 때만 투명
  const isTransparent = isMyPage && !isScrolled;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-10 h-14 transition-all duration-500 ${
        isTransparent
          ? "bg-transparent border-none shadow-none" // 투명 상태
          : "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm" // 불투명 상태 (약간의 블러 효과 추가)
      }`}
    >
      {/* --- 왼쪽: 로고 --- */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/PhotoExpoLogo2.png"
            alt="Logo"
            width={120} // 원하는 기본 가로 길이
            height={30} // 원하는 기본 세로 길이
            style={{ width: "auto", height: "auto" }} // 비율 유지 강제
            priority
            // 투명할 때는 로고를 흰색으로 반전 (로고가 검은색일 경우)
            className={`transition-all duration-300 ${isTransparent ? "brightness-0 invert" : ""}`}
          />
        </Link>
      </div>

      {/* --- 중앙: 메뉴 --- */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 flex gap-8 font-bold transition-colors duration-300 ${
          isTransparent ? "text-white" : "text-gray-700 hover:text-black"
        }`}
      ></div>

      {/* --- 오른쪽: 버튼 세트 --- */}
      <div className="flex items-center gap-4">
        {isLoggedIn && (
          <Link
            href="/create"
            className={`text-xs font-black px-4 py-1.5 rounded-full transition-all duration-300 ${
              isTransparent
                ? "bg-white text-black hover:bg-gray-200" // 투명할 땐 흰색 버튼
                : "bg-black text-white hover:bg-gray-800" // 불투명할 땐 검은색 버튼
            }`}
          >
            프로젝트 생성
          </Link>
        )}

        {!isLoggedIn ? (
          <Link
            href="/login"
            className={`px-8 h-10 flex items-center rounded-full border-2 font-black transition-all duration-300 ${
              isTransparent
                ? "text-white border-white hover:bg-white/10"
                : "text-blue-600 border-blue-600 hover:bg-blue-50"
            }`}
          >
            로그인
          </Link>
        ) : (
          <ProfileDropdown />
          /* ProfileDropdown 내부 아이콘 색상 조절을 위해 props 전달 권장 */
        )}
      </div>
    </nav>
  );
}

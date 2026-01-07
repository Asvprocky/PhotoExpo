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

  // 마이페이지 여부 확인
  const isMyPage = pathname === "/user/info";

  useEffect(() => {
    setMounted(true); // 브라우저 마운트 완료
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // 하이드레이션 에러 방지: 서버와 클라이언트의 첫 렌더링 결과(HTML)를 일치시킵니다.
  // 마운트 전에는 투명 모드를 비활성화하여 서버의 기본 HTML과 맞춥니다.
  const isTransparent = mounted && isMyPage && !isScrolled;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-10 h-14 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-none shadow-none"
          : "bg-white border-b border-gray-100 shadow-sm"
      }`}
    >
      {/* --- 1. 왼쪽 영역 (로고) --- */}
      <div className="flex items-center gap-6">
        <Link href="/">
          <Image
            src="/PhotoExpoLogo2.png"
            alt="Logo"
            width={144}
            height={30}
            priority
            className={isTransparent ? "brightness-0 invert" : ""}
          />
        </Link>
      </div>

      {/* --- 2. 중앙 영역 (메뉴) --- */}
      <div
        className={`absolute left-1/2 transform -translate-x-1/2 flex gap-8 text-base font-bold tracking-tight transition-colors ${
          isTransparent ? "text-white" : "text-gray-700"
        }`}
      >
        <Link href="/exhibition" className="hover:opacity-70">
          Exhibition
        </Link>
      </div>

      {/* --- 3. 오른쪽 영역 (전시 제작 + 유저 메뉴) --- */}
      <div className="flex items-center justify-end min-w-[250px] gap-4">
        {/* 태그 구조의 일치(Hydration)를 위해 항상 같은 부모 div를 유지합니다. */}
        <div
          className={`flex items-center gap-4 transition-opacity duration-300 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* 전시 제작 버튼: 가로채기 라우트 방지를 위해 @modal/exhibition/create 설정을 확인하세요. */}
          <Link
            href="/exhibition/create"
            replace={true}
            className={`text-xs font-black px-4 py-1.5 rounded-full transition-all ${
              isTransparent
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            전시 제작
          </Link>

          {/* 로그인 상태에 따른 버튼 처리 */}
          {!isLoggedIn ? (
            <Link
              href="/login"
              className={`flex items-center justify-center px-8 h-10 border-2 rounded-full transition-all font-black ${
                isTransparent
                  ? "text-white border-white hover:bg-white/10"
                  : "text-blue-600 border-blue-600 hover:bg-blue-50"
              }`}
            >
              로그인
            </Link>
          ) : (
            <ProfileDropdown />
          )}
        </div>
      </div>
    </nav>
  );
}

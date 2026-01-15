"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollY = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 현재 페이지가 생성 페이지인지 확인
  const isCreatePage = pathname === "/create";

  const checkLogin = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    setMounted(true);
    checkLogin();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      // Create 페이지 전용 로직
      if (isCreatePage) {
        // 1. 아래로 조금이라도 내려가면(100px 기준) 숨김
        if (currentScrollY > 100) {
          setIsVisible(false);
        }
        // 2. [수정 포인트] 페이지 최상단 근처(예: 30px 미만)로 올라와야만 다시 보임
        if (currentScrollY < 30) {
          setIsVisible(true);
        }
      } else {
        // 일반 페이지는 항상 보이게 유지
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("loginChange", checkLogin);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("loginChange", checkLogin);
    };
  }, [isCreatePage]);

  if (!mounted) return null;

  /* ==========================================================
   * [핵심 로직 변경]
   * Create 페이지에서는 스크롤 여부와 상관없이 '호버'했을 때만 펼쳐지게 설정
   * ========================================================== */
  const isExpanded = isCreatePage
    ? isHovered // Create 페이지: 마우스를 올려야만 펼쳐짐
    : !isScrolled || isHovered; // 일반 페이지: 기존 로직 유지

  return (
    <nav
      onMouseEnter={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        timerRef.current = setTimeout(() => setIsHovered(false), 1000);
      }}
      className={`fixed z-[40] left-1/2 -translate-x-1/2 transition-all duration-1300 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center border border-white/20 shadow-lg cursor-pointer overflow-visible 
        
        ${
          isExpanded
            ? "top-4 w-[min(1024px,90%)] h-16 rounded-full px-10 bg-white/90 backdrop-blur-sm"
            : "top-2 w-[180px] h-12 rounded-full px-5 bg-white/80 backdrop-blur-md"
        }
        ${!isVisible ? "-translate-y-[150%] opacity-0" : "translate-y-0 opacity-100"}
      `}
    >
      {/* 로고 영역 */}
      <div
        className={`flex-shrink-0 transition-all duration-500 ${
          !isExpanded ? "scale-90" : "scale-100"
        }`}
      >
        <Link href="/">
          <Image
            src="/PhotoExpoLogo2.png"
            alt="Logo"
            width={100}
            height={25}
            style={{ width: "auto", height: "auto" }}
            priority
            className="brightness-0"
          />
        </Link>
      </div>

      {/* 컨텐츠 영역 (펼쳐졌을 때만 노출) */}
      <div
        className={`flex items-center w-full transition-all duration-300 overflow-visible ${
          !isExpanded ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-8 font-bold text-gray-700 whitespace-nowrap"></div>
        <div className="ml-auto flex items-center gap-4 whitespace-nowrap overflow-visible">
          {isLoggedIn && (
            <Link
              href="/create"
              className="px-5 py-2 text-[10px] tracking-[0.2em] text-gray-800 border border-gray-800 rounded-full hover:border-black hover:text-black transition-all uppercase active:bg-gray-50"
            >
              Project +
            </Link>
          )}
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="group flex items-center gap-3 px-4 py-2 text-[10px] font-black tracking-[0.2em] hover:text-black transition-all uppercase"
            >
              <span>Access</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-1 transition-transform"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ) : (
            <ProfileDropdown />
          )}
        </div>
      </div>
    </nav>
  );
}

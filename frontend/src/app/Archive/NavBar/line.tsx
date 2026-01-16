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
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    // [추가] JWT 토큰 만료 여부 직접 계산
    try {
      // JWT는 "header.payload.signature" 구조이며, payload(두 번째)에 만료 정보가 있습니다.
      const base64Payload = token.split(".")[1];
      const payload = JSON.parse(atob(base64Payload)); // Base64 디코딩

      const now = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)

      if (payload.exp && payload.exp < now) {
        //  만료된 경우: 토큰 지우고 로그아웃 처리
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        console.warn("Session expired. Logged out automatically.");
      } else {
        //  유효한 경우
        setIsLoggedIn(true);
      }
    } catch (e) {
      // 토큰 형식이 잘못된 경우 등 에러 처리
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkLogin();

    // 사용자가 페이지에 머무는 동안 5초마다 만료 여부 자동 체크 (폴링)
    const interval = setInterval(() => {
      checkLogin();
    }, 5000);

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
    // 자리를 비운 사이 만료되었을 상황을 대비합니다.
    window.addEventListener("focus", checkLogin);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("loginChange", checkLogin);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("loginChange", checkLogin);
      window.removeEventListener("focus", checkLogin);
      clearInterval(interval);
    };
  }, [pathname]);

  if (!mounted) return null;

  /* ==========================================================
   * [핵심 로직 변경]
   * Create 페이지에서는 스크롤 여부와 상관없이 '호버'했을 때만 펼쳐지게 설정
   * ========================================================== */
  const isExpanded = isCreatePage
    ? isHovered // Create 페이지: 마우스를 올려야만 펼쳐짐
    : !isScrolled || isHovered; // 일반 페이지: 기존 로직 유지

  return (
    // Navbar.tsx 내 nav 태그 부분 수정
    <nav
      onMouseEnter={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        timerRef.current = setTimeout(() => setIsHovered(false), 1000);
      }}
      className={`fixed z-[40] left-1/2 -translate-x-1/2 transition-all duration-1300 ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center overflow-visible
    
    /* 📍 캡슐 제거 및 하단 검정 선 추가 */
    border-b-2 border-black bg-transparent
    
    ${
      isExpanded
        ? "top-4 w-[min(1024px,90%)] h-16 px-4" // 확장 시: 넓은 라인
        : "top-4 w-[180px] h-12 px-2" // 축소 시: 짧은 라인
    }
    
    /* 등장/숨김 애니메이션 */
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
            className="brightness-0" // 검정 선과 맞추기 위해 로고도 완전한 검정으로 유지
          />
        </Link>
      </div>

      {/* 컨텐츠 영역 (펼쳐졌을 때만 노출) */}
      <div
        className={`flex items-center w-full transition-all duration-300 overflow-visible ${
          !isExpanded ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* 중앙 여백용 */}
        <div className="flex-1"></div>

        <div className="ml-auto flex items-center gap-6 whitespace-nowrap overflow-visible font-bold text-[10px] tracking-[0.2em] text-black uppercase">
          {isLoggedIn && (
            <Link href="/create" className="hover:opacity-50 transition-opacity">
              Project +
            </Link>
          )}
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="flex items-center gap-2 hover:opacity-50 transition-opacity"
            >
              <span>Access</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ) : (
            /* 📍 ProfileDropdown도 라인 스타일에 맞춰 배경 없는 것이 어울립니다 */
            <ProfileDropdown />
          )}
        </div>
      </div>
    </nav>
  );
}

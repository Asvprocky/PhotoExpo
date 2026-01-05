"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false); // 마운트 상태 하이드레이션 문제.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 1. 브라우저에 컴포넌트가 나타나면 mounted를 true로 변경
    setMounted(true);

    // 2. 로그인 토큰 확인
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, [pathname]);

  return (
    <div className="navbar">
      <Link href="/">
        <Image
          src="/PhotoExpoLogo2.png"
          alt="PhotoExpo Logo"
          width={380}
          height={60}
          className="w-32 h-auto ml-0"
          priority
        />
      </Link>

      <Link href="/user/info">MyPage</Link>

      {/* 3. 중요: mounted가 true(클라이언트 로드 완료)일 때만 
            로그인/로그아웃 버튼을 그립니다. 
      */}
      {mounted && (
        <>
          {/* 로그인 전: 토큰이 없을 때 */}
          {!isLoggedIn && (
            <>
              <Link href="/login">Login</Link>
              <Link href="/join">Join</Link>
            </>
          )}

          {/* 로그인 후: 토큰이 있을 때 */}
          {isLoggedIn && <LogoutButton />}
        </>
      )}
    </div>
  );
}

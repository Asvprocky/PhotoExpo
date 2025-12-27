"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CookiePage() {
  // 1. Next.js router
  const router = useRouter();

  // 2. 페이지 진입 시 실행
  useEffect(() => {
    // 3. 쿠키 → JWT 교환 함수
    const exchangeToken = async () => {
      try {
        // 4. 백엔드에 쿠키 포함 요청
        const res = await fetch("http://localhost:8080/jwt/exchange", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 쿠키 전달 핵심
        });

        // 5. 인증 실패 처리
        if (!res.ok) {
          throw new Error("인증 실패");
        }

        // 6. JWT 응답 받기

        const json = await res.json();

        // 7. 토큰 저장
        localStorage.setItem("accessToken", json.accessToken);
        localStorage.setItem("refreshToken", json.refreshToken);

        document.cookie = `accessToken=${json.accessToken}; path=/; max-age=3600; SameSite=Lax`;

        // 8. 메인 페이지 이동
        router.replace("/");
      } catch (error) {
        // 9. 실패 시 로그인 페이지로
        alert("소셜 로그인 실패");
        router.replace("/login");
      }
    };

    exchangeToken();
  }, [router]);

  // 10. 로딩 UI
  return <p>로그인 처리 중입니다...</p>;
}

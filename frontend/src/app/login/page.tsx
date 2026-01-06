"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // 회원가입 링크를 위해 추가

const BASE_URL = "http://localhost:8080";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.replace("/"); // 이미 로그인했다면 홈으로 튕겨냄
    }
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("LOGIN_FAILED");
      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
      router.replace("/");
    } catch {
      setErrorMsg("로그인 정보가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: "google" | "naver") => {
    window.location.href = `${BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-white px-4">
      <div className="w-full max-w-[400px] space-y-8">
        {/* 헤더 부분 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">로그인</h1>
          <p className="mt-2 text-sm text-gray-600">PhotoExpo에 오신 것을 환영합니다.</p>
        </div>

        {/* 입력 폼 영역 */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />

          {errorMsg && <p className="text-sm text-red-500 text-center font-medium">{errorMsg}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-md"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </div>

        {/* 소셜 로그인 영역 */}
        <div className="space-y-3">
          <div className="relative flex items-center justify-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">
              또는 소셜 계정으로 로그인
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin("google")}
              className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
            >
              구글
            </button>
            <button
              onClick={() => handleSocialLogin("naver")}
              className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
            >
              네이버
            </button>
          </div>
        </div>

        {/* 회원가입 링크 */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            아직 계정이 없으신가요?{" "}
            <Link href="/join" className="text-blue-600 font-bold hover:underline">
              지금 가입하세요
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

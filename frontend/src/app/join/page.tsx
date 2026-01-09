"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BASE_URL = "http://localhost:8080";

// --- API 로직 ---
async function checkEmailExistsFetch(email: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/user/exist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("EMAIL_CHECK_FAILED");
  return await res.json();
}

async function joinFetch(data: any) {
  const res = await fetch(`${BASE_URL}/user/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("JOIN_FAILED");
}

export default function JoinPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.replace("/"); // 이미 로그인했다면 홈으로 튕겨냄
    }
  }, [router]);

  // 이메일 중복 체크 (Debounce)
  useEffect(() => {
    if (!email.includes("@") || email.length < 5) {
      setIsEmailValid(null);
      return;
    }
    const delay = setTimeout(async () => {
      try {
        const exists = await checkEmailExistsFetch(email);
        setIsEmailValid(!exists);
      } catch {
        setIsEmailValid(null);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [email]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isEmailValid !== true) {
      setError("이메일을 확인해주세요.");
      setLoading(false);
      return;
    }

    try {
      await joinFetch({ email, password, username, nickname });
      alert("회원가입 완료!");
      router.replace("/login");
    } catch {
      setError("회원가입 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-white px-4">
      <div className="w-full max-w-[400px] space-y-8">
        {/* 헤더: 로그인 페이지와 동일 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">회원가입</h1>
          <p className="mt-2 text-sm text-gray-600">PhotoExpo의 새로운 멤버가 되어보세요.</p>
        </div>

        {/* 입력 폼: 로그인 페이지의 input/button 클래스 그대로 적용 */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-1">
            <input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
            {/* 이메일 상태 메시지: 로그인 에러 메시지 폰트 스타일 적용 */}
            <div className="px-1 h-4">
              {email.includes("@") && isEmailValid === false && (
                <p className="text-xs text-red-500 font-medium">이미 가입된 이메일입니다.</p>
              )}
              {email.includes("@") && isEmailValid === true && (
                <p className="text-xs text-blue-600 font-medium">사용 가능한 이메일입니다.</p>
              )}
            </div>
          </div>

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />

          <input
            type="text"
            placeholder="이름"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />

          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />

          {error && <p className="text-sm text-red-500 text-center font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading || isEmailValid !== true}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-md"
          >
            {loading ? "가입 중..." : "가입하기"}
          </button>
        </form>

        {/* 하단 링크: 로그인 페이지 하단 스타일 적용 */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

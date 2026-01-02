"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- API 로직 ---
const BASE_URL = "http://localhost:8080";

interface JoinRequest {
  email: string;
  password: string;
  username: string;
  nickname: string;
}

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

async function joinFetch(data: JoinRequest) {
  const res = await fetch(`${BASE_URL}/user/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("JOIN_FAILED");
}

// --- 페이지 컴포넌트 ---
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
      router.push("/login");
    } catch {
      setError("회원가입 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <h1>회원가입</h1>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {email.includes("@") && isEmailValid === false && (
        <span style={{ color: "red" }}>이미 가입된 이메일</span>
      )}
      {email.includes("@") && isEmailValid === true && (
        <span style={{ color: "green" }}>사용 가능</span>
      )}
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="이름"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={loading || isEmailValid !== true}>
        가입하기
      </button>
    </form>
  );
}

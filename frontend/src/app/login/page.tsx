"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "http://localhost:8080";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

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
      router.push("/");
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
    <div style={{ maxWidth: "400px", margin: "100px auto" }}>
      <h1>로그인</h1>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%" }}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%" }}
      />
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <button onClick={handleLogin} disabled={loading} style={{ width: "100%" }}>
        로그인
      </button>
      <div>
        <button onClick={() => handleSocialLogin("google")}>구글 로그인</button>
        <button onClick={() => handleSocialLogin("naver")}>네이버 로그인</button>
      </div>
    </div>
  );
}

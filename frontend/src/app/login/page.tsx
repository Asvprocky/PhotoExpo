"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  // 타입스크립트 정의
  type OAuthProvider = "google" | "naver";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("로그인 실패");
      }

      const json = await res.json();

      // 예: { accessToken: "...", refreshToken: "..." }
      localStorage.setItem("accessToken", json.accessToken);
      localStorage.setItem("refreshToken", json.refreshToken);

      // document.cookie를 사용하여 브라우저 쿠키에 토큰을 저장.
      document.cookie = `accessToken=${json.accessToken}; path=/; max-age=3600; SameSite=Lax`;

      // 리프레시 토큰도 필요하다면 쿠키에 저장
      // document.cookie = `refreshToken=${json.refreshToken}; path=/; max-age=3600; SameSite=Lax`;

      // 로그인 성공 → 메인 페이지 이동
      router.push("/");
    } catch (error) {
      setErrorMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 소셜 로그인
  const handleSocialLogin = (provider: OAuthProvider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto" }}>
      <h1>로그인</h1>

      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <button onClick={handleLogin} disabled={loading} style={{ width: "100%" }}>
        {loading ? "로그인 중..." : "로그인"}
      </button>
      <div>
        <button onClick={() => handleSocialLogin("google")}>구글로 로그인하기</button>
        <button onClick={() => handleSocialLogin("naver")}>네이버로 로그인하기</button>

        <button></button>
      </div>
    </div>
  );
}

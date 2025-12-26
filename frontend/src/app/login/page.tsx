"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      // 로그인 성공 → 메인 페이지 이동
      router.push("/");
    } catch (error) {
      setErrorMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
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
    </div>
  );
}

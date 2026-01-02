"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginFetch } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();

  type OAuthProvider = "google" | "naver";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      await loginFetch(email, password);
      router.push("/");
    } catch (e) {
      setErrorMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

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
      </div>
    </div>
  );
}

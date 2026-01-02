"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { joinFetch } from "@/services/joinFetch";
import { checkEmailExistsFetch } from "@/services/checkEmailExistsFetch";
export default function JoinForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 이메일 중복 검사 (debounce)
  useEffect(() => {
    if (!email.includes("@") || email.length < 5) {
      setIsEmailValid(null);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const exists = await checkEmailExistsFetch(email);
        setIsEmailValid(!exists); // true = 사용 가능
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
      await joinFetch({
        email,
        password,
        username,
        nickname,
      });

      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      router.push("/login");
    } catch {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
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
        {loading ? "가입 중..." : "회원가입"}
      </button>
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();

  // DTO 구조에 맞춘 상태 관리
  // UserRequestDTO: email(ID), password, username(이름), nickname
  const [email, setEmail] = useState(""); // 로그인 ID 겸 이메일
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null); // 중복 검사 상태

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // 실명 (User Name)
  const [nickname, setNickname] = useState(""); // 별명

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. 이메일(ID) 중복 확인 (useEffect + Debounce)
  useEffect(() => {
    const checkEmail = async () => {
      // 이메일 형식이 아니거나 너무 짧으면 검사 안 함
      if (!email.includes("@") || email.length < 5) {
        setIsEmailValid(null);
        return;
      }

      try {
        // DTO의 existGroup에 맞춰 { email: "..." } 전송
        const res = await fetch("http://localhost:8080/user/exist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }),
        });

        if (res.ok) {
          // true(존재함) -> 사용불가, false(존재안함) -> 사용가능
          const exists = await res.json();
          setIsEmailValid(!exists);
        }
      } catch (err) {
        console.error(err);
        setIsEmailValid(null);
      }
    };

    const delay = setTimeout(checkEmail, 300);
    return () => clearTimeout(delay);
  }, [email]);

  // 2. 회원가입 요청 함수
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 유효성 검사 (DTO 제약조건 반영)
    if (!email.includes("@")) {
      setError("올바른 이메일 형식을 입력해주세요.");
      setLoading(false);
      return;
    }
    if (password.length < 4) {
      setError("비밀번호는 최소 4자 이상이어야 합니다.");
      setLoading(false);
      return;
    }
    if (username.length < 2 || username.length > 20) {
      setError("이름은 2자 이상 20자 이하여야 합니다.");
      setLoading(false);
      return;
    }
    if (nickname.length < 2 || nickname.length > 20) {
      setError("닉네임은 2자 이상 20자 이하여야 합니다.");
      setLoading(false);
      return;
    }

    if (isEmailValid === false) {
      setError("이미 사용 중인 이메일입니다.");
      setLoading(false);
      return;
    }

    try {
      // DTO 필드명에 맞춰 전송: { email, password, username, nickname }
      const res = await fetch("http://localhost:8080/user/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          username,
          nickname,
        }),
      });

      if (!res.ok) {
        throw new Error("회원가입 실패");
      }

      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      router.push("/login");
    } catch (err) {
      console.error(err);
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>회원 가입</h1>

      <form
        onSubmit={handleSignUp}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        {/* 이메일 (ID) 입력 */}
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            이메일 (로그인 ID)
          </label>
          <input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {/* 중복 확인 메시지 */}
          <div style={{ fontSize: "12px", marginTop: "5px", height: "15px" }}>
            {email.includes("@") && isEmailValid === false && (
              <span style={{ color: "red" }}>이미 가입된 이메일입니다.</span>
            )}
            {email.includes("@") && isEmailValid === true && (
              <span style={{ color: "green" }}>사용 가능한 이메일입니다.</span>
            )}
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            비밀번호
          </label>
          <input
            type="password"
            placeholder="4자 이상 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={4}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* 이름 (Username) 입력 */}
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            이름 (실명)
          </label>
          <input
            type="text"
            placeholder="홍길동"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={2}
            maxLength={20}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* 닉네임 입력 */}
        <div>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            닉네임
          </label>
          <input
            type="text"
            placeholder="별명 (2~20자)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            minLength={2}
            maxLength={20}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* 에러 메시지 */}
        {error && <p style={{ color: "red", textAlign: "center", fontSize: "14px" }}>{error}</p>}

        {/* 가입 버튼 */}
        <button
          type="submit"
          disabled={loading || isEmailValid !== true}
          style={{
            marginTop: "10px",
            padding: "12px",
            backgroundColor: loading || isEmailValid !== true ? "#ccc" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading || isEmailValid !== true ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}

import React from "react";
import { cookies } from "next/headers";
import Link from "next/link";

// 백엔드 응답 데이터 타입 정의 (DTO 기반)
interface UserResponse {
  userId: number;
  email: string;
  username: string; // 실명
  nickname: string; // 별명
}

export default async function UserInfoPage() {
  // 1. 쿠키에서 accessToken 읽기 (서버 컴포넌트 전용)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  // [디버깅] 서버 터미널에 쿠키 상태 출력
  console.log("--- [UserInfoPage] Cookie Check ---");
  console.log("Access Token 존재 여부:", accessToken ? "O" : "X");

  // 토큰이 없으면 로그인 안내 표시
  if (!accessToken) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2 style={{ color: "red", marginBottom: "10px" }}>로그인이 필요합니다.</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          브라우저에 인증 쿠키가 없습니다.
          <br />
          로그인 페이지에서 <strong>다시 로그인</strong> 해주세요.
        </p>
        <Link
          href="/login"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          로그인 페이지로 이동
        </Link>
      </div>
    );
  }

  let userInfo: UserResponse | null = null;
  let errorMsg = "";

  try {
    // 2. 백엔드로 내 정보 요청 (Authorization 헤더 추가)
    const res = await fetch("http://localhost:8080/user/info", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`, // Bearer 토큰 방식
        "Content-Type": "application/json",
      },
      cache: "no-store", // 항상 최신 정보 조회
    });

    if (res.ok) {
      const json = await res.json();
      console.log("--- [UserInfoPage] Backend Response ---", json); // 디버깅용

      // 백엔드가 { data: {...} } 로 줄 수도 있고 바로 {...} 로 줄 수도 있어서 둘 다 처리
      userInfo = json.data || json;
    } else {
      console.error("Info Fetch Failed:", res.status);
      errorMsg = `유저 정보를 불러올 수 없습니다. (상태코드: ${res.status})`;
    }
  } catch (error) {
    console.error("Server Error:", error);
    errorMsg = "서버와 연결할 수 없습니다.";
  }

  // 에러 발생 시 UI
  if (errorMsg) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "red" }}>
        <h3>{errorMsg}</h3>
        <p>토큰이 만료되었거나 서버 오류일 수 있습니다.</p>
        <br />
        <Link href="/login" style={{ textDecoration: "underline", color: "blue" }}>
          다시 로그인하기
        </Link>
      </div>
    );
  }

  // 3. 정상 렌더링
  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "100px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "30px", textAlign: "center" }}
      >
        내 정보
      </h1>

      {userInfo ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={rowStyle}>
            <span style={labelStyle}>이메일 (ID)</span>
            <span style={valueStyle}>{userInfo.email}</span>
          </div>

          <div style={rowStyle}>
            <span style={labelStyle}>이름 (실명)</span>
            <span style={valueStyle}>{userInfo.username}</span>
          </div>

          <div style={rowStyle}>
            <span style={labelStyle}>닉네임</span>
            <span style={valueStyle}>{userInfo.nickname}</span>
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Link
              href="/"
              style={{
                padding: "10px 20px",
                backgroundColor: "#333",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "4px",
              }}
            >
              메인으로
            </Link>
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>정보를 불러오는 중입니다...</p>
      )}
    </div>
  );
}

// 스타일 객체
const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  paddingBottom: "10px",
  borderBottom: "1px solid #eee",
};

const labelStyle = {
  fontWeight: "bold" as const,
  color: "#555",
};

const valueStyle = {
  color: "#000",
};

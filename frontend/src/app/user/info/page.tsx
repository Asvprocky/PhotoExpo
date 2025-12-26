import React from "react";
import { cookies } from "next/headers";

interface UserInfo {
  userId: number;
  email: string;
  nickname: string;
  username: string;
}

export default async function UserInfoPage() {
  // 1. 쿠키에서 accessToken 읽기 (추천 방식)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return <div>로그인이 필요합니다.</div>;
  }

  // 2. 백엔드 요청
  const res = await fetch("http://localhost:8080/info", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>유저 정보를 불러오지 못했습니다.</div>;
  }

  const data: UserInfo = await res.json();

  // 3. 화면 렌더링
  return (
    <div style={{ maxWidth: "500px", margin: "100px auto" }}>
      <h1>내 정보</h1>

      <p>
        <strong>ID:</strong> {data.userId}
      </p>
      <p>
        <strong>이메일:</strong> {data.email}
      </p>
      <p>
        <strong>닉네임:</strong> {data.nickname}
      </p>
      <p>
        <strong>이름:</strong> {data.username}
      </p>
    </div>
  );
}

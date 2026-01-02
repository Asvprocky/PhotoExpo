"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserResponse {
  userId: number;
  email: string;
  username: string;
  nickname: string;
}

export default function UserInfo() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.replace("/login");
      return;
    }

    fetch("http://localhost:8080/user/info", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("UNAUTHORIZED");
        return res.json();
      })
      .then((data) => setUserInfo(data.data || data))
      .catch(() => {
        setError("인증이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("accessToken");
        router.replace("/login");
      });
  }, [router]);

  if (error) return <p>{error}</p>;
  if (!userInfo) return <p>로딩 중...</p>;

  return (
    <div>
      <h1>내 정보</h1>
      <p>이메일: {userInfo.email}</p>
      <p>이름: {userInfo.username}</p>
      <p>닉네임: {userInfo.nickname}</p>
      <Link href="/">메인으로</Link>
    </div>
  );
}

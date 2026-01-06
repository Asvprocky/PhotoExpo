"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserResponse {
  email: string;
  username: string;
  nickname: string;
}

export default function UserInfoPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [error, setError] = useState("");

  // 페이지 최초 진입 시 1번 실행
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    //  accessToken 없으면 로그인 페이지
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
      .then((data) => {
        setUserInfo(data.data ?? data);
      })
      .catch(() => {
        setError("인증이 만료되었습니다.");
        localStorage.removeItem("accessToken");
        router.replace("/login");
      });
  }, [router]);

  //  로딩 중
  if (!userInfo && !error) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 1. 상단 와이드 커버 */}
      <div className="relative h-[280px] w-full bg-gray-200">
        <Image src="/photoExpoBanner.jpg" alt="Wide Cover" fill className="object-cover" />
        {/* 이미지 위에 어두운 오버레이 추가 (글자 가독성 확보) */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* 2. 프로필 콘텐츠 */}
      <div className="max-w-[1400px] mx-auto px-10 relative">
        <div className="flex flex-col md:flex-row gap-12">
          {/* 좌측 프로필 */}
          <div className="w-full md:w-[350px] -mt-15 z-10">
            <div className="w-25 h-25 rounded-full border-[6px] border-white overflow-hidden shadow-md mb-6 bg-white">
              <Image src="/photoExpo_Profile_Image.jpg" alt="Profile" width={160} height={160} />
            </div>

            {/* 서버에서 받아온 데이터 사용 */}
            <h1 className="text-4xl font-black text-gray-900 mb-2">{userInfo?.nickname}</h1>

            <div className="space-y-4 text-sm font-bold text-gray-600">
              <div className="flex items-center gap-2">✉️ {userInfo?.email}</div>
              <div className="flex items-center gap-2">👤 {userInfo?.username}</div>
            </div>

            <button className="w-full mt-8 py-3 bg-[#0057ff] text-white font-black rounded-full hover:bg-blue-700 transition-all">
              프로필 정보 편집
            </button>
          </div>

          {/* 우측 탭 영역 */}
          <div className="flex-1 py-10">
            <div className="flex gap-10 border-b border-gray-100 mb-8 overflow-x-auto">
              {["전시", "사진"].map((tab, i) => (
                <button
                  key={i}
                  className={`pb-4 text-sm font-black whitespace-nowrap ${
                    i === 0 ? "border-b-2 border-black text-black" : "text-gray-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 font-bold">
                + 프로젝트 제작
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

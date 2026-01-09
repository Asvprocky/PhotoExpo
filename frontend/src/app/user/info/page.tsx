"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 데이터 타입 정의
interface UserResponse {
  email: string;
  username: string;
  nickname: string;
}

interface Exhibition {
  exhibitionId: number;
  title: string;
  thumbnailUrl?: string;
}

interface Photo {
  photoId: number;
  photoId_real?: number;
  imageUrl: string;
  title?: string;
}

export default function UserInfoPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [activeTab, setActiveTab] = useState("전시");
  const [myExhibitions, setMyExhibitions] = useState<Exhibition[]>([]);
  const [myPhotos, setMyPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.replace("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // 유저 정보
        const userRes = await fetch("http://localhost:8080/user/info", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!userRes.ok) throw new Error("로그인 만료");
        const userData = await userRes.json();
        setUserInfo(userData.data ?? userData);

        // 전시 정보
        const exRes = await fetch("http://localhost:8080/exhibition/my", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!exRes.ok) throw new Error("로그인 만료");
        const exData = await exRes.json();
        setMyExhibitions(exData ?? []);

        // 사진 정보
        const phRes = await fetch("http://localhost:8080/photo/my", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!phRes.ok) throw new Error("로그인 만료");
        const phData = await phRes.json();
        setMyPhotos(phData ?? []);

        setLoading(false);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("accessToken"); // 토큰 제거
        router.replace("/login"); // 로그인 페이지로 이동
      }
    };

    fetchData();
  }, [router]);

  // 삭제 핸들러
  const handleDeleteExhibition = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("이 전시회를 삭제하시겠습니까?")) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const res = await fetch(`http://localhost:8080/exhibition/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setMyExhibitions((prev) => prev.filter((ex) => ex.exhibitionId !== id));
      alert("삭제되었습니다.");
    }
  };

  const handleDeletePhoto = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("이 사진을 삭제하시겠습니까?")) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const res = await fetch(`http://localhost:8080/photo/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setMyPhotos((prev) => prev.filter((ph) => ph.photoId !== id));
      alert("삭제되었습니다.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 배너 */}
      <div className="relative h-[280px] w-full bg-gray-200 -mt-14">
        <Image src="/photoExpoBanner.jpg" alt="Wide Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="max-w-[1400px] mx-auto px-10 relative">
        <div className="flex flex-col md:flex-row gap-12">
          {/* 좌측 프로필 */}
          <div className="w-full md:w-[350px] -mt-16 z-10">
            <div className="w-25 h-25 rounded-full border-[6px] border-white overflow-hidden shadow-md mb-6 bg-white relative">
              <Image
                src="/photoExpo_Profile_Image.jpg"
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">{userInfo?.nickname}</h1>
            <div className="space-y-4 text-sm font-bold text-gray-600">
              <div className="flex items-center gap-2">✉️ {userInfo?.email}</div>
              <div className="flex items-center gap-2">👤 {userInfo?.username}</div>
            </div>
            <button className="w-full mt-8 py-3 bg-[#0057ff] text-white font-black rounded-full hover:bg-blue-700 transition-all">
              프로필 정보 편집
            </button>
          </div>

          {/* 우측 콘텐츠 영역 */}
          <div className="flex-1 py-10">
            {/* 탭 메뉴 */}
            <div className="flex gap-10 border-b border-gray-100 mb-8">
              {["전시", "사진"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-black transition-all ${
                    activeTab === tab
                      ? "border-b-2 border-black text-black"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* 탭 내용 */}
            {activeTab === "전시" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myExhibitions.map((ex) => (
                  <div
                    key={ex.exhibitionId}
                    onClick={() => router.push(`/exhibition/${ex.exhibitionId}`)}
                    className="group aspect-[4/3] relative rounded-xl overflow-hidden cursor-pointer shadow-sm bg-gray-100"
                  >
                    {ex.thumbnailUrl && (
                      <Image
                        src={ex.thumbnailUrl}
                        alt={ex.title}
                        fill
                        className="object-cover transition-all group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => handleDeleteExhibition(e, ex.exhibitionId)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-full font-bold transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                      <p className="text-white font-black text-xl tracking-tight">{ex.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {myPhotos.map((photo) => (
                  <div
                    key={photo.photoId}
                    className="group aspect-square relative rounded-lg overflow-hidden shadow-sm bg-gray-100 cursor-pointer"
                    onClick={() => router.push(`/photo/${photo.photoId}`)}
                  >
                    <Image
                      src={photo.imageUrl}
                      alt="My Photo"
                      fill
                      className="object-cover transition-all group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => handleDeletePhoto(e, photo.photoId)}
                          className="bg-white/20 hover:bg-red-500 text-white text-[10px] px-2 py-1 rounded transition-colors backdrop-blur-md"
                        >
                          삭제
                        </button>
                      </div>
                      <span className="text-white text-[11px] font-bold truncate">
                        {photo.title || "Untitled"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

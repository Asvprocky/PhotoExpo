"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "http://localhost:8080";

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
  viewCount?: number;
  likeCount?: number;
}

interface Photo {
  photoId: number;
  imageUrl: string;
  title?: string;
  photoViewCount?: number;
  photoLikeCount?: number;
}
async function getExhibitions() {
  try {
    const res = await fetch(`${BASE_URL}/exhibition/all`, { next: { tags: ["exhibition"] } });
    return res.ok ? res.json() : [];
  } catch (error) {
    return [];
  }
}

async function getPhotos() {
  try {
    const res = await fetch(`${BASE_URL}/photo/all`, { next: { tags: ["photos"] } });
    return res.ok ? res.json() : [];
  } catch (error) {
    return [];
  }
}

export default function UserInfoPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [activeTab, setActiveTab] = useState("전시");
  const [myExhibitions, setMyExhibitions] = useState<Exhibition[]>([]);
  const [myPhotos, setMyPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  // 삭제 모달을 위한 상태
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; type: "전시" | "사진" } | null>(
    null
  );

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      router.replace("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${accessToken}` };

        const [userRes, exRes, phRes] = await Promise.all([
          fetch("http://localhost:8080/user/info", { headers }),
          fetch("http://localhost:8080/exhibition/my", { headers }),
          fetch("http://localhost:8080/photo/my", { headers }),
        ]);

        if (!userRes.ok || !exRes.ok || !phRes.ok) throw new Error("로그인 만료");

        const userData = await userRes.json();
        setUserInfo(userData.data ?? userData);
        setMyExhibitions((await exRes.json()) ?? []);
        setMyPhotos((await phRes.json()) ?? []);

        setLoading(false);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("accessToken");
        router.replace("/login");
      }
    };

    fetchData();
  }, [router]);

  // 모달 열기 핸들러
  const openDeleteModal = (e: React.MouseEvent, id: number, type: "전시" | "사진") => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTarget({ id, type });
  };

  // 실제 삭제 처리 로직
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const { id, type } = deleteTarget;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const endpoint = type === "전시" ? `exhibition/${id}` : `photo/${id}`;

    try {
      const res = await fetch(`http://localhost:8080/${endpoint}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        if (type === "전시") {
          setMyExhibitions((prev) => prev.filter((ex) => ex.exhibitionId !== id));
        } else {
          setMyPhotos((prev) => prev.filter((ph) => ph.photoId !== id));
        }
        setDeleteTarget(null); // 모달 닫기
      }
    } catch (err) {
      console.error("삭제 중 오류 발생:", err);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 배너 */}
      <div className="relative h-[280px] w-full bg-gray-200 -mt-14">
        <Image
          src="/photoExpoBanner.jpg"
          alt="Wide Cover"
          fill
          className="object-cover"
          crossOrigin="anonymous"
        />
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
                crossOrigin="anonymous"
              />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">{userInfo?.nickname}</h1>
            <div className="space-y-4 text-sm font-bold text-gray-600">
              {/*<div className="flex items-center gap-2">✉️ {userInfo?.email}</div>*/}
              <div className="flex items-center gap-2">👤 {userInfo?.username}</div>
            </div>
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
                        className="object-cover transition-all"
                        crossOrigin="anonymous"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => openDeleteModal(e, ex.exhibitionId, "전시")}
                          className="bg-white/20 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold transition-colors"
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
                      className="object-cover transition-all"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => openDeleteModal(e, photo.photoId, "사진")}
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

      {/*  수정된 커스텀 삭제 확인 모달 */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 transition-opacity"
          onClick={() => setDeleteTarget(null)} // 배경 클릭 시 닫기
        >
          <div
            className="bg-white rounded-xl p-8 max-w-[340px] w-full mx-4 shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
          >
            <div className="text-center">
              <h3 className="text-base font-black text-gray-900 mb-2 uppercase tracking-tight">
                삭제 확인
              </h3>
              <p className="text-gray-500 text-xs mb-8 leading-relaxed">
                선택한 {deleteTarget.type}을(를) 삭제합니다.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmDelete}
                className="w-full py-3.5 bg-gray-400 text-white rounded-lg font-black text-xs hover:bg-zinc-800 transition-colors uppercase tracking-widest"
              >
                삭제하기
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="w-full py-3.5 bg-white border-1 border-gray-300 text-gray-900 rounded-lg font-black text-xs hover:bg-gray-50 transition-colors uppercase tracking-widest"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

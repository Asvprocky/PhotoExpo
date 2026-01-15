"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ModalProps {
  children: React.ReactNode;
  title?: string;
  photoId?: number; // optional
  exhibitionId?: number;
  user?: {
    nickname: string;
    email: string;
  };
}

interface Comment {
  id: number;
  nickname: string;
  content: string;
  createdAt: string;
  mine: boolean; // 작성자 확인 필드
}

export default function Modal({ children, title, user, photoId, exhibitionId }: ModalProps) {
  const isPhoto = !!photoId;
  const isExhibition = !!exhibitionId && !photoId;

  if (!photoId && !exhibitionId) {
    console.error(" Modal에 photoId 또는 exhibitionId가 필요합니다");
    return null;
  }

  const API_BASE_URL = "http://localhost:8080";

  // --- 추가: 토큰 가져오기 함수 ---
  const getAuthHeader = (): Record<string, string> => {
    // 클라이언트 사이드인지 확인 (Next.js SSR 에러 방지)
    if (typeof window === "undefined") return {};

    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  const isLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("accessToken");
  };

  const router = useRouter();
  const overlay = useRef<HTMLDivElement>(null);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");

  const onDismiss = () => router.back();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, []);

  /* ---------------- API 로직 (주소 직접 사용) ---------------- */

  // 1. 댓글 조회 (사진일 때만 동작하도록 가드 추가)
  const fetchComments = async () => {
    // [추가] 사진이 아니거나 photoId가 없으면 호출 안함
    if (!isPhoto || !photoId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/comment/photo/${photoId}`, {
        method: "GET",
        headers: { ...getAuthHeader() },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("댓글 조회 에러:", error);
    }
  };
  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/comment/${commentId}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeader(),
        },
        credentials: "include",
      });

      if (!res.ok) {
        alert("삭제 권한이 없거나 오류가 발생했습니다.");
        return;
      }

      // 삭제 성공 → 댓글 다시 불러오기
      fetchComments();
    } catch (e) {
      console.error("댓글 삭제 에러", e);
    }
  };

  // 좋아요 상태 조회
  const fetchLikeStatus = async () => {
    try {
      // [수정] 호출할 URL을 타입에 따라 엄격하게 구분
      let url = "";
      if (isPhoto && photoId) {
        url = `${API_BASE_URL}/photo/${photoId}/like`;
      } else if (isExhibition && exhibitionId) {
        url = `${API_BASE_URL}/exhibition/${exhibitionId}/like`;
      }

      if (!url) return; // URL이 없으면 실행 안함

      const res = await fetch(url, {
        method: "GET",
        headers: { ...getAuthHeader() },
        credentials: "include",
      });

      if (!res.ok) return;
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (e) {
      console.error("좋아요 상태 조회 에러:", e);
    }
  };

  // 2. 좋아요 토글
  const toggleLike = async () => {
    if (!isLoggedIn()) {
      alert("로그인이 필요한 기능입니다");
      return;
    }

    try {
      const url = isPhoto
        ? `${API_BASE_URL}/photo/${photoId}/like/toggle`
        : `${API_BASE_URL}/exhibition/${exhibitionId}/like/toggle`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
        },
        credentials: "include",
      });

      if (res.status === 401) {
        alert("로그인이 필요합니다");
        return;
      }

      if (!res.ok) {
        console.error("LIKE API ERROR:", res.status);
        return;
      }

      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error("LIKE ERROR:", error);
    }
  };

  // 3. 댓글 작성
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn()) {
      alert("로그인이 필요한 기능입니다");
      return;
    }
    if (!comment.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/comment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(), // 토큰 추가
        },
        credentials: "include",
        body: JSON.stringify({
          photoId,
          content: comment,
        }),
      });
      // 401 처리
      if (res.status === 401) {
        alert("로그인이 필요합니다");
        return;
      }

      if (res.ok) {
        setComment("");
        fetchComments();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // 1. 좋아요 정보는 사진/전시 공통으로 가져옴
    fetchLikeStatus();

    // 2. 댓글은 사진일 때만 가져옴
    if (isPhoto) {
      fetchComments();
    } else {
      setComments([]); // 전시일 때는 댓글 리스트 초기화
    }
  }, [photoId, exhibitionId]); // 의존성 배열 유지
  return (
    <div
      ref={overlay}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95"
      onClick={(e) => e.target === overlay.current && onDismiss()}
    >
      <button
        onClick={onDismiss}
        className="fixed top-8 right-10 z-[70] text-white/50 hover:text-white text-2xl"
      >
        ✕
      </button>

      <div className="w-full h-full overflow-y-auto flex justify-center">
        <div className="w-full max-w-7xl relative px-4">
          {(title || user?.nickname) && (
            <div className="absolute top-6 left-2 z-[70] text-white">
              <p className="text-sm font-black">{title}</p>
              <p className="text-xs text-gray-400">{user?.nickname}</p>
            </div>
          )}

          <div className="pt-24 pb-20">
            {children}

            {/* 좋아요 버튼 섹션 */}
            <div className="mt-16 flex items-center gap-4">
              <button
                onClick={toggleLike}
                className={`px-6 py-2.5 rounded-full border transition-colors flex items-center gap-2 ${
                  liked
                    ? "bg-white text-black border-white"
                    : "border-white/20 text-white hover:bg-white/10"
                }`}
              >
                <span>{liked ? "❤️" : "🤍"}</span>
                <span className="font-bold">{likeCount}</span>
              </button>
            </div>

            {/* 댓글 섹션 */}
            {isPhoto && (
              <div className="mt-12 border-t border-white/10 pt-10">
                <h3 className="text-white font-bold mb-6">댓글 {comments.length}</h3>

                <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-10">
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="댓글을 남겨보세요"
                    className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-sm rounded-lg text-white focus:outline-none focus:border-white/40"
                  />
                  <button className="bg-white text-black px-8 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                    게시
                  </button>
                </form>

                <div className="space-y-8">
                  {comments.length > 0 ? (
                    comments.map((c) => (
                      <div key={c.id} className="flex gap-4 group relative">
                        {" "}
                        {/* group과 relative 추가 */}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            {" "}
                            {/* justify-between 추가 */}
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-white">{c.nickname}</span>
                              <span className="text-[10px] text-gray-500">
                                {new Date(c.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {/* 삭제 버튼: 아이콘 형태 */}
                            {c.mine && (
                              <button
                                onClick={() => handleDeleteComment(c.id)}
                                className="opacity-0 group-hover:opacity-100 transition-all p-1 text-gray-500 hover:text-red-400"
                                title="댓글 삭제"
                              >
                                {/* 쓰레기통 또는 X 아이콘 (SVG) */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed pr-6">{c.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm py-10 text-center">댓글을 남겨보세요</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

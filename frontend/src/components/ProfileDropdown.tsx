"use client";

import Link from "next/link";
import Image from "next/image";

export default function ProfileDropdown() {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  return (
    <div className="relative group flex items-center">
      {/* --- 프로필 아이콘 --- */}
      <div className="cursor-pointer py-2 px-2 z-[101]">
        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200">
          <Image
            src="/photoExpo_Profile_Image.jpg"
            alt="Profile"
            width={36}
            height={36}
            className="object-cover"
          />
        </div>
      </div>

      {/* --- 드롭다운 메뉴  --- */}
      <div className="absolute right-[-10px] top-[50px] w-72 bg-white border border-gray-200 shadow-2xl rounded-xl invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-[100]">
        {/* "이어지는 화살표" (CSS Triangle) */}
        {/*<div className="absolute top-[-8px] right-[20px] w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45 z-[-1]"></div>*/}

        {/* 상단 배경/커버 섹션 */}
        <div className="relative h-24 bg-gray-900 rounded-t-xl overflow-visible">
          {/* 상단 커버 이미지 (나중에 배경색 대신 이미지 삽입 가능) */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-sm bg-white">
            <Image src="/photoExpo_Profile_Image.jpg" alt="Profile Large" width={80} height={80} />
          </div>
        </div>

        {/* 유저 정보 (간격 확보를 위해 mt-12 추가) */}
        <div className="pt-12 pb-6 px-6 text-center border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-900">Jason Lee</h3>
          <p className="text-sm font-medium text-gray-500">cytron1225@naver.com</p>
        </div>

        {/* 메뉴 리스트 (사진 속 항목 반영) */}
        <div className="py-2 max-h-[400px] overflow-y-auto">
          <div className="px-6 py-3 text-[12px] font-black text-gray-400 uppercase tracking-widest"></div>
          <Link
            href="/user/info"
            className="block px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            프로필
          </Link>
          <Link
            href="/settings"
            className="block px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            설정
          </Link>
          <div className="border-t border-gray-100 my-1"></div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-6 py-3 text-sm font-bold text-red-500 hover:bg-gray-50"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

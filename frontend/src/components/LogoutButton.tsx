"use client";
import { useRouter } from "next/navigation";
import { logoutFetch } from "../services/auth";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogOut = async () => {
    try {
      await logoutFetch();
      alert("로그아웃 되었습니다.");
      router.push("/login");
    } catch (e) {
      console.error(e);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return <button onClick={handleLogOut}>LogOut</button>;
};

export default LogoutButton;

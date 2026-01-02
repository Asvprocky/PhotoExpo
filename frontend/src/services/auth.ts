// 1. 공통 서버 주소 설정
const BASE_URL = "http://localhost:8080";

// 2. 타입 정의 (나중에 src/types/auth.ts로 분리하게 좋음)
export interface JoinRequest {
  email: string;
  password: string;
  username: string;
  nickname: string;
}

/**
 * [인증이 필요한 요청용]
 * 모든 요청에 accessToken을 붙이고, 만료 시 자동으로 갱신.
 */
export async function authFetch(url: string, options: RequestInit = {}) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const res = await fetch(url, {
    ...options,
    credentials: "include", // refreshToken 쿠키 전송
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // accessToken 만료 처리 (401 Unauthorized)
  if (res.status === 401) {
    const refreshRes = await fetch(`${BASE_URL}/jwt/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
      throw new Error("인증 만료");
    }

    const { accessToken: newAccessToken } = await refreshRes.json();
    localStorage.setItem("accessToken", newAccessToken);

    // 원래 요청 재시도
    return fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  }

  return res;
}

/**
 * [로그인]
 */
export async function loginFetch(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("LOGIN_FAILED");
  }

  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken); // 토큰 저장
  return data;
}

/**
 * [회원가입]
 */
export async function joinFetch(data: JoinRequest) {
  const res = await fetch(`${BASE_URL}/user/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("JOIN_FAILED");
  }
}

/**
 * [이메일 중복 체크]
 */
export async function checkEmailExistsFetch(email: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/user/exist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("EMAIL_CHECK_FAILED");
  }

  return await res.json(); // true | false
}

/**
 * [로그아웃]
 */
export async function logoutFetch() {
  await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  localStorage.removeItem("accessToken"); // 토큰 삭제
}

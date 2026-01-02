export async function authFetch(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem("accessToken");

  const res = await fetch(url, {
    ...options,
    credentials: "include", // refreshToken 쿠키 전송
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // accessToken 만료
  if (res.status === 401) {
    const refreshRes = await fetch("http://localhost:8080/jwt/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
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

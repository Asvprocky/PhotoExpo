export async function loginFetch(email: string, password: string) {
  const res = await fetch("http://localhost:8080/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("LOGIN_FAILED");
  }

  const data = await res.json();

  // accessToken은 프론트에서 관리
  localStorage.setItem("accessToken", data.accessToken);
}

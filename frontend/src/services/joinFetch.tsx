interface JoinRequest {
  email: string;
  password: string;
  username: string;
  nickname: string;
}

export async function joinFetch(data: JoinRequest) {
  const res = await fetch("http://localhost:8080/user/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("JOIN_FAILED");
  }
}

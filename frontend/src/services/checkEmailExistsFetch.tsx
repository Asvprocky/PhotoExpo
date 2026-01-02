export async function checkEmailExistsFetch(email: string): Promise<boolean> {
  const res = await fetch("http://localhost:8080/user/exist", {
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

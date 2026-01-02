export async function logoutFetch() {
  await fetch("http://localhost:8080/logout", {
    method: "POST",
    credentials: "include",
  });

  localStorage.removeItem("accessToken");
}

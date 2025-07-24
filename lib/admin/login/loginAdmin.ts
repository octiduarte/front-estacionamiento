export async function loginAdmin(user: string, password: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user, password }),
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("401");
    }
  }
  const data = await res.json();
  return data.token;
}

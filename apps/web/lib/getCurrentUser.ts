import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cms/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorBody = await res.text();
      console.log(`[getCurrentUser] API error: ${res.status} ${res.statusText}`, errorBody);
      return null;
    }

    // The API returns { user: {...}, role: "..." }
    const data = await res.json();
    return {
      ...data.user,
      role: data.role
    }; 
  } catch (error) {
    console.error("[getCurrentUser] Failed to fetch user:", error);
    return null;
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  try {
    // Note: The backend mounts adminRoutes at /cms/admin, and the router handles /users
    // So the full path is /cms/admin/users
    console.log(`[Proxy] Forwarding to ${process.env.NEXT_PUBLIC_API_URL}/cms/admin/users`);
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cms/admin/users`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Proxy] Backend returned ${res.status}: ${errorText}`);
      return NextResponse.json(
        { message: `Backend error: ${res.status}`, details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

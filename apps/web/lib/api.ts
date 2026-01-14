import { supabase } from "./supabase";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const session = (await supabase.auth.getSession()).data.session;

  const headers = {
    ...options.headers,
    Authorization: session
      ? `Bearer ${session.access_token}`
      : "",
    "Content-Type": "application/json",
  };

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers,
  });
}

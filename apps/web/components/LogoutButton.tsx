"use client";

import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        // Clear the server-readable cookie
        document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax; Secure";
        window.location.href = "/login";
      }}
      className="text-xs text-gray-500 hover:text-white hover:underline transition-colors w-full text-left"
    >
      Sign Out
    </button>
  );
}

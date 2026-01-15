"use client";

import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax; Secure";
        window.location.href = "/";
      }}
      className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
    >
      Sign Out
    </button>
  );
}

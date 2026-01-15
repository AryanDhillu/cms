"use client";

import { useRouter } from "next/navigation";

export function LanguageSelector({ languages, currentLanguage }: { languages: string[], currentLanguage: string }) {
  const router = useRouter();
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400 text-sm font-medium uppercase tracking-wide">Audio:</span>
      <select 
        value={currentLanguage}
        onChange={(e) => {
          const lang = e.target.value;
          // Use window.location to ensure a full refresh if needed, but router.push is better for SPA feel.
          // However, user asked for "Page reloads with ?language=xx", so router.push is fine, standard Next.js behavior.
          router.push(`?language=${lang}`);
        }}
        className="bg-black/40 border border-white/30 text-white rounded px-3 py-1.5 text-sm backdrop-blur-md hover:bg-black/60 transition-colors cursor-pointer focus:outline-none focus:border-white"
      >
          {languages.map(lang => (
              <option key={lang} value={lang} className="bg-gray-900 text-gray-200">
                  {lang.toUpperCase()}
              </option>
          ))}
      </select>
    </div>
  );
}

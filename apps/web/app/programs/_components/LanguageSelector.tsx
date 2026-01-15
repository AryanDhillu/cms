"use client";

import { useRouter } from "next/navigation";

export function LanguageSelector({ languages, currentLanguage }: { languages: string[], currentLanguage: string }) {
  const router = useRouter();
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">Audio:</span>
      <select 
        value={currentLanguage}
        onChange={(e) => {
          const lang = e.target.value;
          router.push(`?language=${lang}`);
        }}
        className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-1.5 text-sm shadow-sm hover:border-indigo-300 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400"
      >
          {languages.map(lang => (
              <option key={lang} value={lang} className="bg-white text-gray-900">
                  {lang.toUpperCase()}
              </option>
          ))}
      </select>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { LanguageSelector } from "../_components/LanguageSelector";

export const dynamic = "force-dynamic";

async function getProgram(id: string) {
  try {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/catalog/programs/${id}`,
        { cache: "no-store" }
      );
    // If 404, valid notFound
    if (!res.ok) return null; 
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function ProgramPage({ params, searchParams }: { 
    params: Promise<{ id: string }>,
    searchParams: Promise<{ language?: string }> 
}) {
  const { id } = await params;
  const { language } = await searchParams;
  const program = await getProgram(id);
  const currentLanguage = language || program?.languagePrimary || 'en';

  if (!program) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Hero Banner */}
      <div className="relative h-[60vh] w-full">
        {program.bannerUrl ? (
             <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${program.bannerUrl})` }}
             >
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
             </div>
        ) : (
            <div className="absolute inset-0 bg-gray-900" />
        )}

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-xl">{program.title}</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl drop-shadow-md mb-8">
                {program.description}
            </p>

            {/* Language Selector */}
            {program.languagesAvailable && program.languagesAvailable.length > 0 && (
                <div className="mb-8">
                    <LanguageSelector 
                        languages={program.languagesAvailable} 
                        currentLanguage={currentLanguage} 
                    />
                </div>
            )}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-12 mt-8">
                        {program.terms?.map((term: any) => (
            <div key={term.id} className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 text-gray-200">
                    <span className="text-gray-500 font-normal mr-2">Term {term.termNumber}</span>
                    {term.title}
                </h2>                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {term.lessons?.map((lesson: any) => (
                        <Link 
                            key={lesson.id} 
                            href={`/watch/${lesson.id}?language=${currentLanguage}`}
                            className="group block bg-gray-900 rounded-md overflow-hidden hover:bg-gray-800 transition-colors"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                {lesson.thumbnailUrl || program.thumbnailUrl ? (
                                    <img 
                                        src={lesson.thumbnailUrl || program.thumbnailUrl} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        alt={lesson.title}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-white/10 transition-colors flex items-center justify-center">
                                     <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                     </div>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-mono font-medium">
                                    {Math.round(lesson.durationMs / 60000)}m
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start gap-2">
                                    <span className="text-gray-500 font-mono text-sm">{lesson.lessonNumber}.</span>
                                    <h3 className="font-medium text-gray-200 text-sm flex-1 leading-tight group-hover:text-white transition-colors">{lesson.title}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}

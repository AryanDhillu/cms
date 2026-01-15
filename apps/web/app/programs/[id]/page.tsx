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

  // Find first lesson to watch
  let firstLessonId = null;
  if (program.terms && program.terms.length > 0) {
      for (const term of program.terms) {
          if (term.lessons && term.lessons.length > 0) {
              firstLessonId = term.lessons[0].id;
              break;
          }
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <Link 
                href="/"
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-medium">Back to Home</span>
            </Link>
        </div>
      </nav>

      <div className="relative w-full h-[85vh] min-h-[600px] mb-12">
        <div className="absolute inset-0">
            {program.bannerUrl ? (
                <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${program.bannerUrl})` }}
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-900/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative container mx-auto px-6 h-full flex flex-col justify-end pb-16 md:pb-24">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-end">
                
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                            SERIES
                        </span>
                        <span className="text-sm text-gray-300 font-bold uppercase tracking-wider backdrop-blur-sm bg-black/30 px-2 py-1 rounded">
                            {program.languagePrimary}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                        {program.title}
                    </h1>

                    <p className="text-lg text-gray-200 max-w-2xl leading-relaxed drop-shadow-sm line-clamp-3 md:line-clamp-none">
                        {program.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 pt-2">
                        {firstLessonId ? (
                            <Link 
                                href={`/watch/${firstLessonId}?language=${currentLanguage}`}
                                className="px-8 py-3.5 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg shadow-white/10"
                            >
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                Start Watching
                            </Link>
                        ) : (
                            <button 
                                className="px-8 py-3.5 bg-gray-200 text-gray-400 font-bold rounded-lg cursor-not-allowed flex items-center gap-2"
                                disabled
                            >
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                Coming Soon
                            </button>
                        )}
                        
                        {program.languagesAvailable && program.languagesAvailable.length > 0 && (
                            <div className="inline-block relative z-20">
                                <LanguageSelector 
                                    languages={program.languagesAvailable} 
                                    currentLanguage={currentLanguage} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="space-y-16">
            {program.terms?.map((term: any) => (
                <div key={term.id} className="scroll-mt-24">
                    <div className="flex items-end gap-3 mb-6 border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Term {term.termNumber}
                        </h2>
                        <span className="text-lg text-gray-500 font-medium mb-0.5 mx-2">•</span>
                         <h3 className="text-xl text-gray-600 font-medium mb-0.5">
                            {term.title}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {term.lessons?.map((lesson: any) => (
                            <Link 
                                key={lesson.id} 
                                href={`/watch/${lesson.id}?language=${currentLanguage}`}
                                className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="aspect-video relative overflow-hidden bg-gray-100">
                                    {lesson.thumbnailUrl || program.thumbnailUrl ? (
                                        <img 
                                            src={lesson.thumbnailUrl || program.thumbnailUrl} 
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            alt={lesson.title}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                            <svg className="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    )}
                                    
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                         <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg transform scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                                            <svg className="w-5 h-5 text-indigo-600 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                         </div>
                                    </div>
                                    
                                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                                        {Math.round(lesson.durationMs / 60000)} min
                                    </div>
                                </div>
                                
                                <div className="p-5">
                                    <div className="flex items-start gap-3">
                                        <span className="text-xs font-bold text-gray-400 mt-1">
                                            {String(lesson.lessonNumber).padStart(2, '0')}
                                        </span>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                            {lesson.title}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

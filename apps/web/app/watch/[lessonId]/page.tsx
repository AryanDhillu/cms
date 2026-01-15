import Link from "next/link";
import { notFound } from "next/navigation";
import { getYoutubeId } from "@/lib/youtube";

async function getLesson(id: string) {
  try {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/catalog/lessons/${id}`,
        { cache: "no-store" } // or revalidate
      );
    if (!res.ok) return null; 
    return await res.json();
  } catch (error) {
    return null;
  }
}

export const dynamic = "force-dynamic";

export default async function WatchPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = await getLesson(lessonId);

  if (!lesson) {
    notFound();
  }

  const youtubeId = getYoutubeId(lesson.videoUrl || "");

  return (
    <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <div className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-linear-to-b from-black/80 to-transparent pointer-events-none">
            <Link href="/" className="pointer-events-auto flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                 <span className="font-medium">Back to Browse</span>
            </Link>
        </div>

        {/* Player Container */}
        <div className="w-full h-screen flex items-center justify-center">
            {youtubeId ? (
                <div className="w-full h-full"> 
                     <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                        title={lesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            ) : (
                <div className="text-center p-12 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
                    <p className="text-gray-400 mb-8">This content cannot be played right now.</p>
                    {lesson.videoUrl && (
                        <div className="bg-gray-900 p-4 rounded text-sm font-mono text-gray-500 break-all border border-gray-800">
                            Source: {lesson.videoUrl}
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
}

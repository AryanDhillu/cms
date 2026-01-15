import Link from "next/link";

export const dynamic = "force-dynamic";

async function getPrograms() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/catalog/programs`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const programs = await getPrograms();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">CMS Platform</span>
          </div>
          <Link 
            href="/login" 
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg"
          >
            Login
          </Link>
        </div>
      </nav>

      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white -z-10" />
        <div className="container mx-auto px-6 py-24 md:py-32 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                <span className="text-sm font-medium text-indigo-700">New Content Added Weekly</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl mx-auto leading-tight">
                Master Your Skills with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Premium Courses</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Unlock your potential with our expertly curated programs. designed to help you learn, grow, and succeed in your professional journey.
            </p>
            <div className="flex justify-center gap-4">
                <button className="px-8 py-4 text-base font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
                    Explore Programs
                </button>
                <button className="px-8 py-4 text-base font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md">
                    Learn More
                </button>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-12">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Programs</h2>
                <p className="text-gray-500 mt-2 text-lg">Browse our catalogue of top-rated learning paths</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {programs.map((program: any) => (
            <Link 
              key={program.id} 
              href={`/programs/${program.id}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                {program.thumbnailUrl ? (
                  <img 
                    src={program.thumbnailUrl} 
                    alt={program.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                    <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">No Preview</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                        Course
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                        {program.languagePrimary === 'en' ? 'English' : program.languagePrimary.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                    {program.title}
                  </h3>
                  {program.description && (
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                        {program.description}
                      </p>
                  )}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-900">Start Learning</span>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                  </div>
              </div>
            </Link>
          ))}
        </div>
        
        {!programs.length && (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 mt-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No programs available yet</h3>
                <p className="text-gray-500 mt-1 max-w-sm">Check back later for new content updates.</p>
            </div>
        )}
      </div>

      <footer className="bg-white border-t border-gray-200 py-12 mt-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-sm">© 2026 CMS Platform. All rights reserved.</p>
            <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors text-sm font-medium">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors text-sm font-medium">Terms</a>
                <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors text-sm font-medium">Contact</a>
            </div>
        </div>
      </footer>
    </div>
  );
}


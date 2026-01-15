import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function getPrograms() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/catalog/programs`,
      { cache: "no-store" } // or revalidate
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
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-red-600">Browse Programs</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {programs.map((program: any) => (
            <Link 
              key={program.id} 
              href={`/programs/${program.id}`}
              className="group block relative aspect-video bg-gray-900 rounded-md overflow-hidden hover:ring-4 ring-white transition-all transform hover:scale-105 duration-300 pointer-events-auto"
            >
              {program.thumbnailUrl ? (
                <img 
                  src={program.thumbnailUrl} 
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <h3 className="font-bold text-lg">{program.title}</h3>
              </div>
            </Link>
          ))}
        </div>
        
        {!programs.length && (
            <div className="text-center py-20 text-gray-500">
                No programs found.
            </div>
        )}
      </div>
    </main>
  );
}


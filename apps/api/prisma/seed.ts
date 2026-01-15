import { prisma } from "../src/lib/prisma";
import { Role } from "@prisma/client";

async function main() {
  console.log("🌱 Seeding catalog with media...");

  const program = await prisma.program.upsert({
    where: { id: "11111111-1111-1111-1111-111111111111" },
    update: {
      title: "Demo Program",
      description: "A Netflix-style demo program showing full capabilities.",
      status: "published",
      publishedAt: new Date(),
      
      languagePrimary: "en",
      languagesAvailable: ["en"],

      thumbnailUrl: "https://images.unsplash.com/photo-1522199710521-72d69614c702",
      bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
      portraitUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    },
    create: {
      id: "11111111-1111-1111-1111-111111111111",
      title: "Demo Program",
      description: "A Netflix-style demo program showing full capabilities.",
      status: "published",
      publishedAt: new Date(),
      
      languagePrimary: "en",
      languagesAvailable: ["en"],
      
      thumbnailUrl: "https://images.unsplash.com/photo-1522199710521-72d69614c702",
      bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
      portraitUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",

      terms: {
        create: [
          {
            title: "Season 1",
            termNumber: 1,
            lessons: {
              create: [
                {
                  lessonNumber: 1,
                  title: "Introduction",
                  contentType: "video",
                  durationMs: 600000,
                  status: "published",
                  publishedAt: new Date(),
                  
                  contentLanguagePrimary: "en",
                  contentLanguagesAvailable: ["en"],
                  contentUrlsByLanguage: { en: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },

                  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
                },
                {
                  lessonNumber: 2,
                  title: "Foundations",
                  contentType: "video",
                  durationMs: 720000,
                  status: "draft",
                  
                  contentLanguagePrimary: "en",
                  contentLanguagesAvailable: ["en"],
                  contentUrlsByLanguage: { en: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },

                  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seeded Program:", program.id);

  const SUPABASE_USER_ID = "b6d7e9bf-a067-436c-b3c6-d2eb4d3f5c40"; 

  await prisma.userRole.upsert({
    where: { userId: SUPABASE_USER_ID },
    update: {},
    create: {
      userId: SUPABASE_USER_ID,
      role: Role.ADMIN,
    },
  });
  
  console.log("✅ Seeded user role for:", SUPABASE_USER_ID);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

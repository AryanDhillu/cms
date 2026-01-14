import { prisma } from "../src/lib/prisma";
import { Role } from "@prisma/client";

async function main() {
  // 1. Upsert Program (Idempotent)
  const program = await prisma.program.upsert({
    where: { id: "11111111-1111-1111-1111-111111111111" },
    update: {},
    create: {
      id: "11111111-1111-1111-1111-111111111111",
      title: "Demo Program",
      status: "published",
      publishedAt: new Date(),
      terms: {
        create: {
          termNumber: 1,
          title: "Term 1",
          lessons: {
            create: {
              lessonNumber: 1,
              title: "Published Lesson",
              status: "published",
              publishedAt: new Date(),
              contentType: "video",
              durationMs: 600000,
            },
          },
        },
      },
    },
  });

  console.log("Seeded program ID:", program.id);

  // 2. Upsert User Role (Idempotent)
  // Replace with your actual Supabase User ID
  const SUPABASE_USER_ID = "b6d7e9bf-a067-436c-b3c6-d2eb4d3f5c40"; 

  await prisma.userRole.upsert({
    where: { userId: SUPABASE_USER_ID },
    update: {},
    create: {
      userId: SUPABASE_USER_ID,
      role: Role.ADMIN,
    },
  });
  
  console.log("Seeded user role for:", SUPABASE_USER_ID);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

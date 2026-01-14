import { prisma } from "../src/lib/prisma";

async function main() {
  const program = await prisma.program.create({
    data: {
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

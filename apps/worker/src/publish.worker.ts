import { prisma } from "./prisma";

async function publishScheduled() {
  const now = new Date();
  
  // Publish Programs
  // Check for both 'draft' and 'scheduled' statuses
  await prisma.program.updateMany({
    where: {
      status: { in: ["draft", "scheduled"] },
      publishAt: { lte: now },
    },
    data: {
      status: "published",
      publishedAt: now,
    },
  });

  // Publish Lessons
  await prisma.lesson.updateMany({
    where: {
      status: { in: ["draft", "scheduled"] },
      publishAt: { lte: now },
    },
    data: {
      status: "published",
      publishedAt: now,
    },
  });

  console.log("Publishing cycle complete");
}

publishScheduled()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { prisma } from "../lib/prisma";

export async function findPublishedProgramById(programId: string) {
  return prisma.program.findFirst({
    where: {
      id: programId,
      status: "published",
      terms: {
        some: {
          lessons: {
            some: { status: "published" },
          },
        },
      },
    },
    include: {
      terms: {
        orderBy: { termNumber: "asc" },
        include: {
          lessons: {
            where: { status: "published" },
            orderBy: { lessonNumber: "asc" },
          },
        },
      },
    },
  });
}

export async function findPublishedLessonById(lessonId: string) {
  return prisma.lesson.findFirst({
    where: {
      id: lessonId,
      status: "published",
      term: {
        program: {
          status: "published",
        },
      },
    },
    include: {
      term: {
        include: {
          program: true,
        },
      },
    },
  });
}

import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { mapProgram, mapLesson } from "../mappers/catalog.mapper";
import { getCatalogProgramById, getCatalogLessonById } from "../services/catalog.service";

export async function getPrograms(req: Request, res: Response) {
  const limit = Number(req.query.limit) || 10;
  const cursor = req.query.cursor as string | undefined;

  const programs = await prisma.program.findMany({
    where: {
      status: "published",
      terms: {
        some: {
          lessons: {
            some: {
              status: "published",
            },
          },
        },
      },
    },
    orderBy: [
      { publishedAt: "desc" },
      { id: "desc" },
    ],
    take: limit + 1,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
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

  let nextCursor: string | null = null;

  if (programs.length > limit) {
    const nextItem = programs.pop();
    nextCursor = nextItem!.id;
  }

  res.json({
    data: programs.map(mapProgram),
    pageInfo: {
      nextCursor,
    },
  });
}

export async function getProgramById(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({
      code: "BAD_REQUEST",
      message: "Invalid ID",
    });
  }

  const program = await getCatalogProgramById(id);

  if (!program) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "Program not found",
    });
  }

  // Cache for public catalog
  res.setHeader("Cache-Control", "public, max-age=60");

  return res.json(mapProgram(program));
}

export async function getLessonById(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({
      code: "BAD_REQUEST",
      message: "Invalid ID",
    });
  }

  const lesson = await getCatalogLessonById(id);

  if (!lesson) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "Lesson not found",
    });
  }

  res.setHeader("Cache-Control", "public, max-age=60");

  return res.json(mapLesson(lesson));
}

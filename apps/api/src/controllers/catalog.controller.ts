import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { mapProgram } from "../mappers/catalog.mapper";

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

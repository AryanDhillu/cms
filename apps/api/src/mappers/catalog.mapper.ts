import { Program, Term, Lesson } from "@prisma/client";

export function mapProgram(program: any) {
  return {
    id: program.id,
    title: program.title,
    publishedAt: program.publishedAt,

    terms: program.terms.map((term: any) => ({
      id: term.id,
      termNumber: term.termNumber,
      title: term.title,

      lessons: term.lessons.map((lesson: any) => ({
        id: lesson.id,
        lessonNumber: lesson.lessonNumber,
        title: lesson.title,
        contentType: lesson.contentType,
        durationMs: lesson.durationMs,
        publishedAt: lesson.publishedAt,
      })),
    })),
  };
}

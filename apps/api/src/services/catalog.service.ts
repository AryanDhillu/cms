import { findPublishedProgramById, findPublishedLessonById } from "../repositories/catalog.repo";

export async function getCatalogProgramById(programId: string) {
  return findPublishedProgramById(programId);
}

export async function getCatalogLessonById(lessonId: string) {
  return findPublishedLessonById(lessonId);
}

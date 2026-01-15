import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// POST /cms/programs/:programId/terms
export const createTerm = async (req: Request, res: Response) => {
  try {
    const programId = req.params.programId as string;
    const { title, termNumber } = req.body;

    if (!programId || !termNumber) {
        return res.status(400).json({ message: "Program ID and term number are required" });
    }
    
    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: "Term title is required" });
    }

    const term = await prisma.term.create({
      data: {
        programId,
        title,
        termNumber,
      },
    });

    res.status(201).json(term);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create term" });
  }
};

// PUT /cms/terms/:id
export const updateTerm = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, termNumber } = req.body;
    
    // Validation
    if (title !== undefined && title.trim().length === 0) {
       return res.status(400).json({ message: "Term title cannot be empty" });
    }

    const term = await prisma.term.update({
      where: { id },
      data: {
        title,
        termNumber,
      },
    });

    res.json(term);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update term" });
  }
};

// GET /cms/terms/:id
export const getTerm = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const term = await prisma.term.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { lessonNumber: 'asc' }
        },
        program: {
            select: { title: true, id: true }
        }
      }
    });

    if (!term) {
      return res.status(404).json({ message: "Term not found" });
    }

    res.json(term);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch term" });
  }
};

// DELETE /cms/terms/:id
export const deleteTerm = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const lessonsCount = await prisma.lesson.count({
      where: { termId: id },
    });

    if (lessonsCount > 0) {
      return res.status(400).json({ message: "Cannot delete term with lessons" });
    }

    await prisma.term.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete term" });
  }
};

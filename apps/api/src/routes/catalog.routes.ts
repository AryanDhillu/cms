import { Router } from "express";
import { getPrograms, getProgramById, getLessonById } from "../controllers/catalog.controller";

const router = Router();

router.get("/programs", getPrograms);
router.get("/programs/:id", getProgramById);
router.get("/lessons/:id", getLessonById);

export default router;

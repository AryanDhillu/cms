import { Router } from "express";
import { listPrograms, getProgramDetail, getLessonDetail } from "../controllers/catalog.controller";

const router = Router();

router.get("/programs", listPrograms);
router.get("/programs/:id", getProgramDetail);
router.get("/lessons/:id", getLessonDetail);

export default router;

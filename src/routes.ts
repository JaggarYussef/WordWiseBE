import { Router } from "express";
import { createWord, getWords } from "./controllers/words.js";
const router = Router();

router.post("/", createWord);
router.get("/", getWords);

export default router;

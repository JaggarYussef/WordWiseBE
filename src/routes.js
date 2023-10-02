import { Router } from "express";
import { createWord } from "./controllers/words.js";
const router = Router();

router.post("/", createWord);

export default router;

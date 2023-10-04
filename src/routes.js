import { Router } from "express";
import { createWord } from "./controllers/createWord.js";
const router = Router();

router.post("/", createWord);

export default router;

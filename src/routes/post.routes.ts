import { authMiddleware } from "../middlewares/auth.middleware";
import { Router } from "express";
import { createPost } from "../controllers/post.controllers";

const router = Router();

router.post("/", authMiddleware, createPost);

export default router;
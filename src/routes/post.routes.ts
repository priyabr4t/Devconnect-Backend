import { authMiddleware } from "../middlewares/auth.middleware";
import { Router } from "express";
import { createPost, getAllPosts, getPostById, deletePost } from "../controllers/post.controllers";

const router = Router();

router.post("/", authMiddleware, createPost);
router.get("/", getAllPosts)
router.get("/:id", getPostById)
router.delete("/:id", authMiddleware, deletePost)

export default router;
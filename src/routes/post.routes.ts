import { authMiddleware } from "../middlewares/auth.middleware";
import { Router } from "express";
import { createPost, getAllPosts, getPostById, deletePost, likePost, getFeed, unlikePost } from "../controllers/post.controllers";

const router = Router();

router.post("/", authMiddleware, createPost);
router.get("/feed", authMiddleware, getFeed);
router.get("/", getAllPosts)
router.get("/:id", getPostById)
router.delete("/:id", authMiddleware, deletePost)
router.post("/:id/like", authMiddleware, likePost)
router.delete("/:id/like", authMiddleware, unlikePost);

export default router;
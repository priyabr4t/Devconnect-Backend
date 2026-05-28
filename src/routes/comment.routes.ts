import express from 'express';
import Comment from '../models/comment.model';
import Post from '../models/post.model';
import { createComment, deleteComment, getCommentsByPostId } from '../controllers/comment.controllers';
import { authMiddleware, } from '../middlewares/auth.middleware';

const router = express.Router();

router.post("/:postId/comments", authMiddleware, createComment);
router.get("/:postId/comments", getCommentsByPostId);
router.delete("/:postId/comments/:commentId", authMiddleware, deleteComment);

export default router;
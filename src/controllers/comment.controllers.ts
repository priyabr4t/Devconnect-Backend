import { Request, Response } from 'express';
import Comment from '../models/comment.model';
import Post from '../models/post.model';
import mongoose from 'mongoose';

export const createComment = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const postId = req.params.postId as string;

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Post ID is required"
            });
        }
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const { content } = req.body;

        if (typeof content !== "string" || content.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Comment content is required"
            });
        }

        const trimmedContent = content.trim();

        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Post ID"
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const newComment = new Comment({
            content: trimmedContent,
            author: userId,
            post: postId
        });

        await newComment.save();

        return res.status(201).json({ success: true, message: 'Comment created successfully', comment: newComment });
    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).json({ success: false, message: 'Failed to create comment' });
    }
};

export const getCommentsByPostId = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId as string;

        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Post ID"
            });
        }
        const comments = await Comment.find({ post: postId })
            .populate("author", "name profileImage bio")
            .sort({ createdAt: -1 }); // newest comment first

        return res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ success: false, message: 'Failed to fetch comments' });
    }
}

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const commentId = req.params.commentId as string;

        if(!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (!mongoose.isValidObjectId(commentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Comment ID"
            });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        if (comment.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You can only delete your own comments"
            });
        }

        await comment.deleteOne();

        return res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ success: false, message: 'Failed to delete comment' });
    }
}

import express from 'express';
import Post from '../models/post.model';

export const createPost = async (req: express.Request, res: express.Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        const { content, image } = req.body;

        if (
            typeof content !== "string" ||
            content.trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Post content is required"
            });
        }

        const trimmedContent = content.trim();
        const newPost = new Post({
            content: trimmedContent,
            author: userId,
            image
        });

        await newPost.save();
        return res.status(201).json({ success: true, message: 'Post created successfully', post: newPost });

    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({ success: false, message: 'Failed to create post' });
    }
};
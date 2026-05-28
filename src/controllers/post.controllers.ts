import { Request, Response } from 'express';
import Post from '../models/post.model';
import mongoose, { mongo } from 'mongoose';

export const createPost = async (req: Request, res: Response) => {
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

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find()
            .populate("author", "name profileImage bio")
            .sort({ createdAt: -1 }) // newst post first

        return res.status(200).json({ success: true, data: posts })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "failed to fetch posts" })
    }
}

export const getPostById = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id as string

        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({ success: false, message: "Invalid Post Id" })
        }

        const post = await Post.findById(postId).populate("author", "name profileImage bio")

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" })
        }

        return res.status(200).json({ success: true, data: post })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Failed to fetch post" })
    }
}

export const deletePost = async (req: Request, res: Response) => {

    try {
        const userId = req.userId

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorised user" })
        }

        const postId = req.params.id

        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({ success: false, message: "Invalid post id" })
        }

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" })
        }

        if (userId != post.author.toString()) {
            return res.status(403).json({ success: false, message: "You can only delete your own posts" })
        }

        await post.deleteOne()

        return res.status(200).json({ success: true, message: "Post deleted successfully" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, message: "Failed to delete post" })
    }

}

export const likePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id as string

        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({ success: false, message: "Invalid post id" })
        }

        const userId = req.userId

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorised" })
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const alreadyLiked = post.likes.some(like => like.toString() === userId);

        if (alreadyLiked) {
            return res.status(400).json({
                success: false,
                message:
                    "Post already liked"
            });
        }


        post.likes.push(new mongoose.Types.ObjectId(userId));

        await post.save();

        return res.status(200).json({
            success: true,
            message:
                "Post liked successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to like post"
        });
    }
}

export const unlikePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id as string

        if (!mongoose.isValidObjectId(postId)) {
            return res.status(400).json({ success: false, message: "Invalid post id" })
        }

        const userId = req.userId

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorised" })
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const alreadyLiked = post.likes.some(like => like.toString() === userId);

        if (!alreadyLiked) {
            return res.status(400).json({
                success: false,
                message:
                    "Post not liked"
            });
        }


        post.likes = post.likes.filter(
            like => like.toString() !== userId
        );

        await post.save();

        return res.status(200).json({
            success: true,
            message:
                "Post unliked successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to unlike post"
        });
    }
}
import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt"
import mongoose from "mongoose";
// FETCH ALL USERS
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("-password");
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching users" });
    }
}

// FETCH USER BY ID
export const getUserById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID"
        });
    }
    try {
        const user = await User.findById(id).select("-password");

        if (user) {
            return res.status(200).json({ success: true, data: user });
        } else {
            return res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching user" });
    }
}

// CREATE NEW USER
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Valid name is required",
            });
        }

        const trimmedName = name.trim();

        if (typeof email !== "string" || email.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Valid email is required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        if (typeof password !== "string" || password.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Valid password is required",
            });
        }

        const trimmedPassword = password.trim();

        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

        const newUser = new User({
            name: trimmedName,
            email: normalizedEmail,
            password: hashedPassword
        });
        await newUser.save();

        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            profileImage: newUser.profileImage,
            bio: newUser.bio
        };

        return res.status(201).json({ success: true, data: userResponse });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error creating user" });
    }
}

// DELETE USER BY ID
export const deleteUserById = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    try {
        const user = await User.findByIdAndDelete(id);
        if (user) {
            return res.status(200).json({ success: true, message: "User deleted successfully" });
        } else {
            return res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting user" });
    }
}

export const updateProfile = async (req: Request, res: Response) => {

    try {

        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const {
            bio,
            profileImage
        } = req.body;

        const updatedUser =
            await User.findByIdAndUpdate(
                userId,
                {
                    bio,
                    profileImage
                },
                {
                    new: true
                }
            ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedUser
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                "Error updating profile"
        });

    }

}
import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken";

export const registerUser = async (req: Request, res: Response) => {
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

        const token = generateToken(newUser._id.toString());

        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            profileImage: newUser.profileImage,
            bio: newUser.bio
        };

        return res.status(201).json({ success: true, data: userResponse, token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error creating user" });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" || email.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Valid email is required",
            });
        }

        if (typeof password !== "string" || password.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Valid password is required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(trimmedPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id.toString());

        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
            bio: user.bio
        };

        return res.status(200).json({ success: true, data: userResponse, token });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error logging in user" });
    }
}   

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error fetching user data" });
    }
}
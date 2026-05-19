import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid authorization header" });
        }

        const token = authHeader.split(" ")[1];
        const secretKey = process.env.JWT_SECRET

        if (!secretKey) {
            return res.status(500).json({ message: "JWT secret key not configured" });
        }

        const decoded = jwt.verify(token, secretKey) as { userId: string };

        console.log("Decoded token:", decoded);

        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}

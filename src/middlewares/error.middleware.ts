import { ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
}
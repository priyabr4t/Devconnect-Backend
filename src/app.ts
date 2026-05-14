import express, { Express } from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes";
import userRoutes from "./routes/user.routes";

const app: Express = express();

// MIDDLEWARES
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());

// ROUTES
app.use("/api", healthRoutes);
app.use("/api", userRoutes);

export default app;
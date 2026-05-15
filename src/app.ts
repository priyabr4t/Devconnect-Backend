import express, { Express } from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes";
import userRoutes from "./routes/user.routes";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

const app: Express = express();

// MIDDLEWARES
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(loggerMiddleware);

// ROUTES
app.use("/api", healthRoutes);
app.use("/api", userRoutes);
app.use(errorMiddleware);

export default app;
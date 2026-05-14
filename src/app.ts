import express, { Express } from "express";
import cors from "cors";
import healthRoutes from "./routes/health.route";

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

export default app;
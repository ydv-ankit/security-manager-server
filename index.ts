import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDb } from "./config/db";
import { logger, requestLogger } from "./utils/logger";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.route";
import dataRoutes from "./routes/data.route";
import { CONSTANTS } from "./utils/constants";
import { authMiddleware } from "./middlewares/auth.middleware";

dotenv.config();

// initializers
const app = express();
const PORT = process.env.PORT || 8080;
const mongoUrl = process.env.MONGO_URI;
const morganFormat = ":method :url :status :response-time ms";
const allowedOrigins = process.env.CORS_ORIGIN_URLS!.split(",");

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g., Postman, mobile apps)
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            // Reject other origins
            return callback(new Error("Not allowed by CORS"));
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);
app.use(
    morgan(morganFormat, {
        stream: {
            write: (message: String) => {
                const logObject = {
                    method: message.split(" ")[0],
                    url: message.split(" ")[1],
                    status: message.split(" ")[2],
                    responseTime: message.split(" ")[3],
                };
                requestLogger.info(JSON.stringify(logObject));
            },
        },
    })
);

// routes
app.use("/health", async (req: Request, res: Response) => {
    res.status(404).json({
        message: "SERVER IS UP",
    });
});
app.use("/user", userRoutes);
app.use("/data", authMiddleware, dataRoutes);
app.use("*", async (req: Request, res: Response) => {
    res.status(404).json({
        message: CONSTANTS.NO_ROUTE,
    });
});

// server listen
app.listen(PORT, () => {
    connectDb(mongoUrl || "");
    logger(`server running on port: ${PORT}`, "INFO");
});

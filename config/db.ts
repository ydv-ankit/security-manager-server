import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const connectDb = async (mongoUrl: string) => {
    try {
        await mongoose.connect(mongoUrl);
        logger("Connected to database", "INFO");
    } catch (error) {
        logger("Database connection error" + error, "ERROR");
        process.exit(1);
    }
};

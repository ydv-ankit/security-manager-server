import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateRefreshAndAccessToken = (userid: string) => {
    const accessToken = jwt.sign({ userid }, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h",
    });
    return { accessToken };
};

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
        process.env.NODE_ENV === "production"
            ? ("none" as "none")
            : ("lax" as "lax"),
};

export { generateRefreshAndAccessToken, cookieOptions };

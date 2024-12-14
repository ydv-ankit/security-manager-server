import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { accessToken } = req?.cookies;

    try {
        const accessTokenPayload = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET!
        );
        req.body.userid = (accessTokenPayload as JwtPayload)?.userid;
        next();
    } catch (error) {
        res.status(401).json({
            message: "UNAUTHORIZED",
        });
    }
};

export { authMiddleware };

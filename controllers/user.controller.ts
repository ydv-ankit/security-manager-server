import { Request, Response } from "express";
import { CONSTANTS } from "../utils/constants";
import { cookieOptions, generateRefreshAndAccessToken } from "../utils/token";
import { UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";

const register = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const isUserExists = await UserModel.findOne({
            username: data.username,
        });

        if (isUserExists) {
            res.status(400).json({
                message: CONSTANTS.USER_EXISTS,
            });
            return;
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(data.password, salt);

        const newUser = await UserModel.create({
            username: data.username,
            password: hashedPassword,
        });
        const { accessToken } = generateRefreshAndAccessToken(
            newUser?._id.toString()
        );
        res.status(201)
            .cookie("accessToken", accessToken, cookieOptions)
            .json({
                message: CONSTANTS.USER_CREATED,
                data: {
                    username: data.username,
                },
            });
    } catch (error) {
        res.status(500).json({
            message: CONSTANTS.INTERNAL_SERVER_ERROR,
        });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const isUserExists = await UserModel.findOne({
            username: data.username,
        });

        if (isUserExists) {
            const verifyPasswordHash = bcrypt.compareSync(
                data.password,
                isUserExists.password
            );
            if (verifyPasswordHash) {
                const { accessToken } = generateRefreshAndAccessToken(
                    isUserExists?._id.toString()
                );
                res.status(201)
                    .cookie("accessToken", accessToken, cookieOptions)
                    .json({
                        message: CONSTANTS.USER_EXISTS,
                        data: {
                            username: isUserExists?.username,
                        },
                    });
                return;
            } else {
                res.status(401).json({
                    message: CONSTANTS.INCORRECT_CREDENTIALS,
                });
            }
        } else {
            res.status(404).json({
                message: CONSTANTS.NO_USER,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: CONSTANTS.INTERNAL_SERVER_ERROR,
        });
    }
};

export { register, login };

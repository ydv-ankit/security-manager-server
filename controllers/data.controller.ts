import { Request, Response } from "express";
import { CONSTANTS } from "../utils/constants";
import { DataModel } from "../models/data.model";
import { decrypt, encrypt } from "../utils/worker";

const getData = async (req: Request, res: Response) => {
    try {
        const userid = req.body.userid;
        const userData = await DataModel.find({
            userid,
        }).select("-userid -__v");
        const decryptedData = userData.map((data) => {
            return {
                _id: data._id,
                site: data.site,
                username: data.username,
                email: data.email,
                password: decrypt(data.password),
                others: data.others,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            };
        });
        res.status(200).json({
            message: CONSTANTS.USER_DATA_FOUND,
            data: decryptedData,
        });
    } catch (error) {
        res.status(500).json({
            message: CONSTANTS.INTERNAL_SERVER_ERROR,
        });
    }
};

const addData = async (req: Request, res: Response) => {
    try {
        if (
            !req.body.password ||
            !req.body.username ||
            !req.body.site ||
            !req.body.email
        )
            throw new Error("invalid data");
        const newData = await DataModel.create({
            userid: req.body.userid,
            site: req.body.site,
            username: req.body.username,
            email: req.body.email,
            password: encrypt(req.body.password),
            others: req.body.others,
        });
        newData.password = decrypt(newData.password);
        res.status(201).json({
            message: CONSTANTS.USER_DATA_ADDED,
            data: newData,
        });
    } catch (error) {
        res.status(500).json({
            message: CONSTANTS.INTERNAL_SERVER_ERROR,
        });
    }
};

const updateData = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const updatedData = await DataModel.findByIdAndUpdate(
            id,
            {
                site: req.body.site,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
                    ? encrypt(req.body.password)
                    : undefined,
                others: req.body.others,
            },
            {
                new: true,
            }
        );

        if (updatedData) {
            updatedData.password = decrypt(updatedData?.password);
            res.status(202).json({
                message: CONSTANTS.USER_DATA_UPDATED,
                data: updatedData,
            });
        } else {
            res.status(400).json({
                message: CONSTANTS.ERROR_OCCURED,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: CONSTANTS.INTERNAL_SERVER_ERROR,
        });
    }
};

const deleteData = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        await DataModel.findByIdAndDelete(id);
        res.status(202).json({
            message: CONSTANTS.USER_DATA_DELETED,
        });
    } catch (error) {
        res.status(500).json({
            message: CONSTANTS.INTERNAL_SERVER_ERROR,
        });
    }
};

export { getData, addData, updateData, deleteData };

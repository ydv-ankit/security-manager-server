import mongoose, { Schema } from "mongoose";

const dataSchema = new Schema(
    {
        userid: {
            type: String,
            required: true,
        },
        site: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        others: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const DataModel = mongoose.model("data", dataSchema);

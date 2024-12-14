import {
    addData,
    deleteData,
    getData,
    updateData,
} from "../controllers/data.controller";
import { Router } from "express";

const router = Router();

router.get("/", getData);
router.post("/", addData);
router.put("/:id", updateData);
router.delete("/:id", deleteData);

export default router;

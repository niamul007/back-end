import express from "express";
import { getItem, postItem } from "../controller/itemController.mjs";

const router = express.Router();
router.get("/items",getItem)
router.post("/add-items", postItem);

export default router;
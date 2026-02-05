import express from "express";
import { getItem, postItem } from "../controller/itemController.mjs";
import { validator } from "../middleware/validator.mjs";

const router = express.Router();
router.get("/items",getItem)
router.post("/add-items",validator,postItem);

export default router;
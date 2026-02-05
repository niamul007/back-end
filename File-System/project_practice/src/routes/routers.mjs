import express from "express";
import { getItem, postItem, delItem } from "../controller/itemController.mjs";
import { validator } from "../middleware/validator.mjs";

const router = express.Router();
router.get("/items", getItem);
router.post("/add-items", validator, postItem);
router.delete("/delete-item/:id", delItem);
export default router;

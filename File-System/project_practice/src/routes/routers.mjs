import express from "express";
import { getItem, postItem, delItem,updateItem } from "../controller/itemController.mjs";
import { validator } from "../middleware/validator.mjs";

const router = express.Router();
router.get("/items", getItem);
router.post("/add-items", validator, postItem);
router.delete("/delete-item/:id", delItem);
router.put("/edit/:id", updateItem);
export default router;

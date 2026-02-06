import express from "express";
import { getItem, postItem, delItem,updateItem ,toggleItem,searchItems} from "../controller/itemController.mjs";
import { validator } from "../middleware/validator.mjs";

const router = express.Router();
router.get("/items", getItem);
router.post("/add-items", validator, postItem);
router.delete("/delete-item/:id", delItem);
router.put("/edit/:id", updateItem);
router.patch("/toggle/:id", toggleItem); // We use PATCH for small updates
router.get("/search", searchItems);
export default router;

import express from "express";
import { getItem, postItem, delItem,updateItem ,toggleItem,searchItems , resetItems} from "../controller/itemController.mjs";
import { validate } from "../middleware/validator.mjs";
import { grocerySchema } from "../middleware/itemValidator.mjs";


const router = express.Router();
router.get("/items", getItem);
router.post("/add-items", validate(grocerySchema), postItem);
router.delete("/delete-item/:id", delItem);
router.put("/edit/:id", updateItem);
router.patch("/toggle/:id", toggleItem); // We use PATCH for small updates
router.get("/search", searchItems);
router.delete("/search/reset",resetItems);
export default router;

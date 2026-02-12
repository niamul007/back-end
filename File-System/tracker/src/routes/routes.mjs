import { getAllData, postData , removeItem  } from "../controller/habitController.mjs";
import express from 'express';
import { validate } from "../middleware/validator.mjs";
import { taskSchema } from "../middleware/habitValidator.mjs";

const router = express.Router();

router.get("/get-task", getAllData);
router.post("/add-task", validate(taskSchema),postData);
router.delete("/delete-task/:id", removeItem)

export default router;
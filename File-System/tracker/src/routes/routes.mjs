import { getAllData, postData  } from "../controller/habitController.mjs";
import express from 'express';
import { validate } from "../middleware/validator.mjs";
import { taskSchema } from "../middleware/habitValidator.mjs";

const router = express.Router();

router.get("/get-task", getAllData);
router.post("/add-task", validate(taskSchema),postData);

export default router;
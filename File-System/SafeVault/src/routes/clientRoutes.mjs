import express from "express";
// Import your "Brain" (Controller)
import { getClients , addClient } from "../controllers/clientControllers.mjs";
// Import your "Guard" (Middleware)
import { validateClient } from "../middleware/validator.mjs";

import { updatePayment } from "../controllers/clientControllers.mjs";

const router = express.Router();

// GET: Fetch all clients
// PATH: http://localhost:3000/api/clients
router.get("/clients", getClients);

// POST: Add a new client
// PATH: http://localhost:3000/api/add
// Notice: validator runs BEFORE addClient
router.post("/add", validateClient, addClient);

router.put("/pay/:id", updatePayment);

export default router;
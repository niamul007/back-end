import express from "express";
// Import your "Brain" (Controller)
import { getClients, addClient } from "../controllers/clientController.mjs";
// Import your "Guard" (Middleware)
import { validateClient } from "../middleware/validator.mjs";

const router = express.Router();

// GET: Fetch all clients
// PATH: http://localhost:3000/api/clients
router.get("/clients", getClients);

// POST: Add a new client
// PATH: http://localhost:3000/api/add
// Notice: validator runs BEFORE addClient
router.post("/add", validateClient, addClient);

export default router;
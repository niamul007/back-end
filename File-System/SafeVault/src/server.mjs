import express from "express";
import clientRoutes from "./routes/clientRoutes.mjs";
import { initStorage } from "./models/clientModel.mjs";
import path from "node:path";

const __dirname = import.meta.dirname;
const app = express();
const PORT = 3000;

// --- 1. MIDDLEWARE ---
// This allows the server to read the JSON data sent from the frontend
// --- 1. MIDDLEWARE ---
app.use(express.json());

// FIXED: Point to the FOLDER, not the file
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath)); 

// --- 2. ROUTES ---
app.use("/api", clientRoutes);

// --- 3. INITIALIZATION & START ---
// We call initStorage to make sure the JSON file exists before the server starts
initStorage()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🛡️ SafeVault Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize system storage:", err);
  });

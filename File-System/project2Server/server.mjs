import express from "express";
import path from "node:path";
import { readPost } from "../Utilities/postHandelers.js";
import { writePost } from "../Utilities/postHandelers.js";
import { error } from "node:console";

const app = express();
const PORT = 4001;
const __dirname = import.meta.dirname;

app.use(express.static(path.join(__dirname, "..", "project2")));
app.use(express.json());

app.get("/name", async (req, res) => {
  const names = await readPost(); // FIX: Get the data first
  res.json(names); // Then send it
});

app.post("/add-task", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Missing data" });
    const readName = await readPost();
    readName.push({ name, id: Date.now() });
    await writePost(readName);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "save failed" });
  }
});

// ... (Your other routes)

// FIX: Changed from app.post to app.delete
app.delete("/delete-name/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const namesArray = await readPost();
    
    // Filter out the item
    const filteredNames = namesArray.filter((n) => n.id != id);
    
    await writePost(filteredNames);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Hi alaka bashi this is your url: http://localhost:${PORT}`);
});

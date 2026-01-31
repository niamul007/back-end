import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readPost, writePost } from "../Utilities/postHandelers.js";

const app = express();
const PORT = 7777;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticFolder = join(__dirname, "..", "expressHtml");

app.use(express.json());
app.use(express.static(staticFolder));

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(join(staticFolder, "taskApp.html"));
});

// Route: Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await readPost();
  res.json(tasks);
});

// Route: Add a task
app.post("/add-task", async (req, res) => {
  try {
    const { name, priority } = req.body; 
    if (!name || !priority) return res.status(400).json({ error: "Missing data" });

    const tasks = await readPost();
    tasks.push({ id: Date.now(), name, priority });
    
    await writePost(tasks);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Save failed" });
  }
});

// Route: Delete a task
app.delete("/delete-task/:id", async (req, res) => {
    try {  
        const { id } = req.params;
        const tasks = await readPost();
        const filteredTasks = tasks.filter(t => t.id != id);
        
        await writePost(filteredTasks);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
});

app.listen(PORT, () => console.log(`🚀 Live at http://localhost:${PORT}`));
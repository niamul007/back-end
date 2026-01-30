import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readPost } from "../Utilities/postHandelers.js";

const app = express();
const PORT = 7777; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1. FIX: Point to the FOLDER, not the file
const staticFolder = join(__dirname, "..", "expressHtml");
app.use(express.static(staticFolder));

app.use(express.json());

// 3. The Data Route for your loadTask() function
app.get("/tasks", async (req, res) => {
    const tasks = await readPost();
    res.json(tasks);
});

app.listen(PORT, () => {
    console.log(`🚀 Task App Live: http://localhost:${PORT}`);
});
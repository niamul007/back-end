import express from "express";
import path from "node:path";
import { readPost } from "../Utilities/postHandelers.js";
import { writePost } from "../Utilities/postHandelers.js";

const PORT = 4000;
const app = express();
const __dirname = import.meta.dirname;

app.use(express.static(path.join(__dirname, "..", "html")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", async (req, res) => {
  const notes = await readPost();
  res.json(notes);
});

app.post("/add-note", async (req, res) => {
  try {
    const { username, message } = req.body;

    // Validation (Senior developers never trust the client!)
    if (!username || !message) {
      return res.status(400).json({ error: "Fields cannot be empty" });
    }

    const currentPosts = await readPost();
    currentPosts.push({ username, message, id: Date.now() });
    await writePost(currentPosts);

    // Send a "Created" status instead of a redirect
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server failed to save" });
  }
});

app.put("/update-note/:id", async (req, res) => {
  const idToUpdate = Number(req.params.id);
  const { message } = req.body;

  const notes = await readPost();
  const updatedNotes = notes.map((note) => {
    if (note.id === idToUpdate) {
      return { ...note, message: message };
    }
    return note;
  });
  await writePost(updatedNotes);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

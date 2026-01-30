import express from 'express';
import path from 'node:path'; // Required for absolute paths
import { readPost } from '../Utilities/postHandelers.js';
import { writePost } from '../Utilities/postHandelers.js';

const app = express();
const PORT = 3000;
const __dirname = import.meta.dirname;

// 1. Static Middleware (Handles CSS, JS, and the default index.html)
// The ../ means "go out of the express folder, then find the html folder"
app.use(express.static(path.join(__dirname, '..', 'html')));
// 2. Body Parser (For your Guestbook forms)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/notes', async (req, res) => {
    const notes = await readPost();
    res.json(notes);
});


app.post('/add-note', async (req, res) => {
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
// Add this to app.mjs
app.delete('/delete-note/:id', async (req, res) => {
    const notes = await readPost();
    const filtered = notes.filter(n => n.id !== Number(req.params.id));
    await writePost(filtered);
    res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
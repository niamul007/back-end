import express from 'express'
import path from 'node:path'
import { readPost } from '../Utilities/postHandelers.js';
import { writePost } from '../Utilities/postHandelers.js';

const app = express();
const PORT = 4000;
const __dirname = import.meta.dirname;

app.use(express.static(path.join(__dirname,"..","html")));
app.use(express.urlencoded({extended: true}));

// 1. Fixed the path (no dot) and the typo (json)
app.get('/notes', async (req, res) => {
    const notes = await readPost();
    res.json(notes); 
});

// 2. Changed to app.post to match the HTML form and allow req.body
// 3. Matched the URL to your form action (/add-note)
app.post('/add-note', async (req, res) => {
    const { username, message } = req.body;

    if (username && message) {
        const currentPosts = await readPost();
        currentPosts.push({ username, message, id: Date.now() });
        await writePost(currentPosts);
    }
    
    res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
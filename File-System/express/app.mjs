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


app.get('/notes', async (req, res) => {
    const notes = await readPost();
    res.json(notes);
});


app.post('/add-note', async (req, res) => {
    // 1. Data is already parsed!
    const { username, message } = req.body; 

    // 2. Save it using your existing utility
    const currentPosts = await readPost();
    currentPosts.push({ username, message, id: Date.now() });
    await writePost(currentPosts);
    // 3. One-line redirect
    res.redirect('/'); 
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
import express from 'express';
import path from 'node:path'; // Required for absolute paths

const app = express();
const PORT = 3000;
const __dirname = import.meta.dirname;

// 1. Static Middleware (Handles CSS, JS, and the default index.html)
app.use(express.static('html'));

// 2. Body Parser (For your Guestbook forms)
app.use(express.urlencoded({ extended: true }));

// 3. Routing
// Note: If index.html exists in /html, going to '/' usually shows it automatically!
// But if you want a specific "About" page:
app.get("/about", (req, res) => {
    // res.sendFile needs an ABSOLUTE path
    const filePath = path.join(__dirname,"..", "html", "index.html");
    res.sendFile(filePath);
});

// 4. API Route (The Guestbook data)
app.get("/notes", (req, res) => {
    // Remember how we stringified manually? Now just:
    res.json({ message: "This is your data served via Express!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
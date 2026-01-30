import express from 'express'
import path from 'node:path'
import { readPost } from '../Utilities/postHandelers.js';
import { writePost } from '../Utilities/postHandelers.js';

const PORT = 4000;
const app = express();
const __dirname = import.meta.dirname;

app.use(express.static(path.join(__dirname,"..",'html')))
app.use(express.urlencoded({extended: true}))

app.get("/notes", async (req, res)=>{
    const notes = await readPost();
    res.json(notes)
})

app.post("/add-note", async (req,res)=>{
    const {username,message} = req.body;
    const content = await readPost()
    content.push({username,message,id: Date.now()});
    await writePost(content)
    res.redirect('/');
})

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})
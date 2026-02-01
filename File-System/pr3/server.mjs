import express from "express"
import path from 'node:path'
import { readPost } from "../Utilities/postHandelers.js";
import { writePost } from "../Utilities/postHandelers.js";


const app = express();
const PORT = 7001;
const __dirname = import.meta.dirname;

app.use(express.static(path.join(__dirname,"..","pr3Html")));
app.use(express.json());

app.get("/", async (req,res)=>{
    const read = await readPost()
    res.json()
})

app.listen(PORT,()=>{
    console.log(`Server running on: http://localhost:${PORT}`)
})
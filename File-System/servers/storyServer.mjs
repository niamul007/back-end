import http from "node:http";
import path from "node:path";
import fs from "node:fs/promises";
import { contentType } from "../Utilities/contentType.js";
import { getData } from "../Utilities/getData.mjs";
import { handleAddStory } from "../Utilities/storyController.js";

const PORT = 3000;
const HOSTNAME = "localhost";
const __dirname = import.meta.dirname;

const server = http.createServer(async (req, res) => {
  const pubDir = path.join(__dirname, "..", "html");

  try {
    // 1. Check for API Routes FIRST
    if (req.url === "/stories" && req.method === "GET") {
      const stories = await getData();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify(stories));
    }

    // 2. Handle POST requests (The ADD story part)
if (req.url === "/add-story" && req.method === "POST") {
      return handleAddStory(req, res); 
    }

    // 3. If it's not an API route, treat it as a Static File request
    const filePath = path.join(pubDir, req.url === "/" ? "story.html" : req.url);
    const extension = path.extname(filePath);
    const mimeType = contentType(extension);
    
    const fileContent = await fs.readFile(filePath);

    res.statusCode = 200;
    res.setHeader("Content-Type", mimeType);
    res.end(fileContent);

  } catch (error) {
    if (error.code === 'ENOENT') {
        res.statusCode = 404;
        res.end("File Not Found");
    } else {
        console.error(`Server Error: ${error.message}`);
        res.statusCode = 500;
        res.end("Internal Server Error");
    }
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
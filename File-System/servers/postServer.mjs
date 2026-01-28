import http from "node:http";
import fs from "node:fs/promises";
import { contentType } from "../Utilities/contentType.js";
import path from "node:path";
import { readPost } from "../Utilities/postHandelers.js";
import { controlPost } from "../controllers/postController.js";
const PORT = 3000;
const HOSTNAME = "localhost";
const __dirname = import.meta.dirname;

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === "/notes" && req.method === "GET") {
      const notes = await readPost();
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify(notes));
    }
    if (req.url === "/add-note" && req.method === "POST") {
      return controlPost(req, res);
    }

    const pubDir = path.join(__dirname, "..", "html");
    const filePath = path.join(
      pubDir,
      req.url === "/" ? "index.html" : req.url,
    );
    const content = await fs.readFile(filePath, "utf-8");
    const ext = path.extname(filePath);
    const mimeType = contentType(ext);
    res.statusCode = 200;
    res.setHeader("Content-Type", mimeType);
    res.end(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      // If a file is missing, just send a 404 quietly instead of console.log
      res.statusCode = 404;
      return res.end("File not found");
    }
    console.log("Error occurred", error.message);
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`server running on: http://${HOSTNAME}:${PORT}`);
});

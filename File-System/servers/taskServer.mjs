import http from "node:http";
import path from "node:path";
import fs from "node:fs/promises";
import { contentType } from "../Utilities/contentType.js";


const PORT = 4000;
const HOSTNAME = "localhost";

const __dirname = import.meta.dirname;

const server = http.createServer(async(req, res) => {
  try {
    const pubDir = path.join(__dirname, "..", "html");
    const filePath = path.join(pubDir, req.url === "/" ? "task.html" : req.url);
    const extension = path.extname(filePath);
    const mimeType = contentType(extension);
    const content = await fs.readFile(filePath);

    res.statusCode = 200;
    res.setHeader("Content-Type", mimeType);
    res.end(content);

  } catch (error) {
    if (error.code === 'ENOENT') {
        const filePath = path.join(__dirname, "..", "Public", "404.html");
        const content = await fs.readFile(filePath);
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html");
        res.end(content);
        return;
    }
    console.error(`Server Error: ${error.message}`);
    res.statusCode = 500;
    res.end("Internal Server Error");

  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Task Server running at http://${HOSTNAME}:${PORT}/`);
});

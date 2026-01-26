import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { contentType } from '../Utilities/contentType.js';

const PORT = 3000;
const HOSTNAME = 'localhost';
const __dirname = import.meta.dirname;

const server = http.createServer(async (req, res) => {
  const pubDir = path.join(__dirname,'..', "html");
  const filePath = path.join(
    pubDir,
    req.url === "/" ? "story.html" : req.url,
  );

  try {
    const extension = path.extname(filePath);
    const mimeType = contentType(extension);
    const fileContent = await fs.readFile(filePath); 
    
    // FIX 2: Removed "utf-8" so it can handle images/CSS/JS without corruption
    res.statusCode = 200;
    
    // Note: This still assumes everything is HTML; 
    // real projects need dynamic Content-Types for CSS/JS to work.
    res.setHeader('Content-Type', mimeType); 
    res.end(fileContent);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.statusCode = 404;
    res.end("File Not Found");
  }
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
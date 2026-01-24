import path from 'node:path';
import fs from 'node:fs/promises';

export async function serveStaticFile(baseDir, res) {
  try {
    const filePath = path.join(baseDir, 'Public', 'index.html');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(fileContent);
  } catch (error) {
    console.error('Error serving file:', error.message);
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('404 - File Not Found');
  }
}
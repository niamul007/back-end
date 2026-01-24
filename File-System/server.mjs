import http from 'node:http';
import { cwd } from 'node:process';

const PORT = 5000;
const HOSTNAME = 'localhost';
const __dirname = import.meta.dirname;

console.log(`Absolute path of current directory: ${__dirname}`);

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
import http from 'node:http';
import { serveStaticFile } from './Utilities/serveStatic.mjs';

const PORT = 5000;
const HOSTNAME = 'localhost';
const __dirname = import.meta.dirname;

const server = http.createServer(async (req, res) => {
  await serveStaticFile(__dirname, res);
});

server.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
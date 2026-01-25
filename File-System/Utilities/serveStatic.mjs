import path from "node:path";
import fs from "node:fs/promises";
import { contentType } from "./contentType.js";

export async function serveStaticFile(baseDir, res, req) {
  try {
    const publicDir = path.join(baseDir, "Public");
    const filePath = path.join(
      publicDir,
      req.url === "/" ? "index.html" : req.url,
    );
    const fileExtension = path.extname(filePath);
    const contentTypeValue = contentType(fileExtension);

    const fileContent = await fs.readFile(filePath, "utf-8");
    res.statusCode = 200;
    res.setHeader("Content-Type", contentTypeValue);
    res.end(fileContent);
  } catch (error) {
    if (error.code === "ENOENT") {
      const errorPath = path.join(baseDir, "Public", "404.html");
      const errorContent = await fs.readFile(errorPath, "utf-8");
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html");
      res.end(errorContent);
      return;
    } else {
      console.error("Error serving file:", error.message);
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("404 - File Not Found");
    }
  }
}

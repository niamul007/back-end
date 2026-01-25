import path from "node:path";
import fs from "node:fs/promises";
import { contentType } from "./contentType.js";
import { sendJSON } from "./sendJSON.mjs";

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
    sendJSON(res,fileContent,200,contentTypeValue);

  } catch (error) {
    if (error.code === "ENOENT") {
      const errorPath = path.join(baseDir, "Public", "404.html");
      const errorContent = await fs.readFile(errorPath, "utf-8");
      sendJSON(res,errorContent,404,"text/html");
      return;
    } else {
      console.error("Error serving file:", error.message);
      sendJSON(res,{ error: "Internal Server Error" },500,"application/json");
      return;
    }
  }
}

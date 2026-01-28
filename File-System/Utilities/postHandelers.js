import path from "node:path";
import fs from "node:fs/promises";

export async function readPost() {
  const __dirname = import.meta.dirname;
  try {
    const filePath = path.join(__dirname, "..", "data", "data.json");
    const postContent = await fs.readFile(filePath, "utf-8"); // Using utf-8 here is safer for parsing strings

    // If file exists but is empty, return empty array
    if (!postContent || postContent.trim() === "") {
      return [];
    }
    return JSON.parse(postContent);
    
  } catch (error) {
    if (error.code === "ENOENT") return [];
    console.error("Error reading data:", error.message);
    return [];
  }
}

export async function writePost(data) {
  const __dirname = import.meta.dirname;

  try {
    const filePath = path.join(__dirname, "..", "data", "data.json");
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving data:", error.message);
    return false;
  }
}

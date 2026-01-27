import fs from "node:fs/promises";
import path from "node:path";

export async function readTask() {
  const __dirname = import.meta.dirname;
  try {
    const filePath = path.join(__dirname, "..", "data", "task.json");
    const taskItem = await fs.readFile(filePath, "utf-8");
    return JSON.parse(taskItem);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    console.error("Error reading data:", error.message);
    return [];
  }
}

export async function writeTask(data) {
  const __dirname = import.meta.dirname;
  try {
    const filePath = path.join(__dirname, "..", "data", "task.json");
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving data:", error.message);
    return false;
  }
}

import path from "node:path";
import fs from "node:fs/promises";

const __dirname = import.meta.dirname;
const filePath = path.join(__dirname, "..", "..", "data","tracker.json");

export async function getAllItem() {
  try {
    const content = await fs.readFile(filePath, "utf-8");

    if (!content || content.trim() === "") {
      return [];
    }

    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(filePath, "[]");
      return [];
    }
    throw new Error("Database read Failed");
  }
}

export async function saveAllItem(data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Critical save error", error.message);
    throw new Error("Database write failed");
  }
}

export async function initStorage() {
  try {
    await fs.access(filePath);
  } catch (error) {
    await fs.writeFile(filePath, "[]");
    console.log("System: Data file initialized");
  }
}

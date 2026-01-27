import fs from "node:fs/promises";
import path from "node:path";

const __dirname = import.meta.dirname;

export async function saveData(data) {
  try {
    const dataPath = path.join(__dirname, '..', 'html', 'data.json');
    // JSON.stringify(data, null, 2) makes the file look "pretty" and readable
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving data:", error.message);
    return false;
  }
}
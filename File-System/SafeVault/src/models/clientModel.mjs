import path from "node:path";
import fs from "node:fs/promises";

// 1. Define the path ONCE at the top. 
// This makes the file cleaner and easier to maintain.
const __dirname = import.meta.dirname;
const filePath = path.join(__dirname, "..","..", "data", "clients.json");

/**
 * LIBRARIAN ROLE: Get all clients from the JSON file
 */
export async function getAllClients() {
  try {
    const content = await fs.readFile(filePath, "utf-8");

    // Check if the file is literally empty (0 characters)
    if (!content || content.trim() === "") {
      return []; 
    }

    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") {
        // If file doesn't exist, create it with an empty array
        await fs.writeFile(filePath, "[]");
        return [];
    }
    throw new Error("Database read failed");
  }
}

/**
 * LIBRARIAN ROLE: Overwrite the JSON file with new array
 */
export async function updateClientsFile(data) {
  try {
    // null, 2 makes the JSON readable for humans (Prettified)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Critical Save Error:", error.message);
    throw new Error("Database write failed");
  }
}

// 4. ADD AN INITIALIZER (Senior Level)
// This ensures the data folder/file exists when the server starts
export async function initStorage() {
    try {
        await fs.access(filePath);
    } catch {
        await fs.writeFile(filePath, "[]");
        console.log("System: Data file initialized.");
    }
}
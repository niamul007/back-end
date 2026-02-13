import path from "node:path";
import fs from "node:fs/promises";
import { pool } from '../config/db.mjs';
const __dirname = import.meta.dirname;
// Good pathing! Ensuring it goes to the root data folder.
const filePath = path.join(__dirname, "..", "..", "data", "habit.json");

export const readData = async () => {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    // Senior move: check if file is empty string
    if (!content || content.trim() === "") return [];
    
    return JSON.parse(content);
  } catch (error) {
    // If file doesn't exist, create it and return empty array
    if (error.code === "ENOENT") {
      await fs.writeFile(filePath, "[]");
      return [];
    }
    // Fixed the string concatenation here
    throw new Error(`Read Error: ${error.message}`);
  }
};

export const writeData = async (data) => {
  try {
    // null, 2 makes the JSON readable for humans (pretty-print)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Critical Write Error:", error.message);
    throw new Error(`Write Error: ${error.message}`);
  }
};

// model/habitModel.mjs

export const initStorage = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log("🚀 Neon Cloud is connected! Time:", res.rows[0].now);
    
    // This creates your table automatically
    await pool.query(`
      CREATE TABLE IF NOT EXISTS habits (
        id SERIAL PRIMARY KEY,
        task TEXT NOT NULL,
        is_done BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    return true;
  } catch (err) {
    console.error("❌ The Model could not reach Neon:", err.message);
    throw err; 
  }
};
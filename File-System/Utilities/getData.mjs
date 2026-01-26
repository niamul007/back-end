import fs from "node:fs/promises";
import path from "node:path";

const __dirname = import.meta.dirname;

export async function getData() {
    try {
        // We go UP from 'utilities' then into 'html'
        const dataPath = path.join(__dirname, '..', 'html', 'data.json');
        const dataContent = await fs.readFile(dataPath, "utf-8");
        return JSON.parse(dataContent);
    }
    catch (error) {
        // If the file doesn't exist yet, return an empty array
        if (error.code === 'ENOENT') return [];
        
        console.error("Error reading data:", error.message);
        return [];
    }
}

export default getData;
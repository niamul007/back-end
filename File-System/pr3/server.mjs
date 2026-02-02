import express from "express";
import path from "node:path";
import { readPost } from "../Utilities/postHandelers.js";
import { writePost } from "../Utilities/postHandelers.js";
import { error } from "node:console";
import e from "express";

const app = express();
const PORT = 7001;
const __dirname = import.meta.dirname;

app.use(express.static(path.join(__dirname, "..", "pr3Html")));
app.use(express.json());

app.get("/expense", async (req, res) => {
  const read = await readPost();
  res.json(read);
});

app.post("/add-expense", async (req, res) => {
  try {
    const { cause, amount } = req.body;
    if (!cause || !amount)
      return res.status(400).json({ error: "Missing data" });
    const read = await readPost();
    read.push({
      cause: cause,
      amount: amount,
      id: Date.now(),
    });
    await writePost(read);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Save failed" });
  }
});

app.delete("/delete-expense/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const idToDel = Number(id);
    const read = await readPost();
    const update = read.filter((i) => i.id !== idToDel);
    await writePost(update);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

app.put("/update-expense/:id", async (req, res) => {
  // Added /
  try {
    const { id } = req.params;
    const { cause } = req.body;
    const data = await readPost();

    const updateEx = data.map((ex) => {
      if (ex.id == id) {
        // Used == for type safety
        return { ...ex, cause: cause };
      }
      return ex; // Return the individual item, not the whole array
    });

    await writePost(updateEx);
    res.json({ success: true });
  } catch (err) {
    console.log(`Problem: ${err}`);
    res.status(500).send("Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
});

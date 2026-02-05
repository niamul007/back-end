import express from "express";
import path from "node:path";
import { initStorage } from "./model/models.mjs";
import router from "./routes/routers.mjs";

const __dirname = import.meta.dirname;
const app = express();
const PORT = 4001;
const filePath = path.join(__dirname, "..", "public");

app.use(express.json());
app.use(express.static(filePath));
app.use("/api", router);

initStorage()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🐱‍🏍Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize system storage:", err);
  });

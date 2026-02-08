import express from "express";
import path from "node:path";
import { initStorage } from "./model/models.mjs";
import router from "./routes/routers.mjs";
import AppError from "./utils/appError.mjs";
import { globalErrorHandler } from "./middleware/errorMiddleware.mjs";

const __dirname = import.meta.dirname;
const app = express();
const PORT = 4051;
const filePath = path.join(__dirname, "..", "public");

app.use(express.json());
app.use(express.static(filePath));
app.use("/api", router);
// ... your routes ...

// 1. Handle "Not Found" routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// 2. The Global Error Handler (Must be at the bottom)
app.use(globalErrorHandler);
initStorage()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🐱‍🏍Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize system storage:", err);
  });

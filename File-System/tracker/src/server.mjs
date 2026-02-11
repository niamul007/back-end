import express from "express";
import path from "node:path";
import { initStorage } from "./model/habitModel.mjs";
import router from "./routes/routes.mjs";
import AppError from "./utility/AppError.mjs";
import { globalErrorHandle } from "./middleware/errorMiddleware.mjs";

const __dirname = import.meta.dirname;
const app = express();
const PORT = 7001;
const filePath = path.join(__dirname, "..", "public");

app.use(express.json());
app.use(express.static(filePath));
app.use("/api", router);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandle);

initStorage()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on : http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize system storage:", err);
  });

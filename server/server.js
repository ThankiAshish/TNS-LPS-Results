import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import filePayloadExists from "./Middleware/filePayloadExists.js";
import fileSizeLimiter from "./Middleware/fileSizeLimiter.js";
import converter from "./Converter/converter.js";

const PORT = 5000;

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  console.log("API is Running!");
});

app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filePayloadExists,
  fileSizeLimiter,
  (req, res) => {
    const { file } = req.files;
    const filepath = path.join(__dirname, "Data", "Data.csv");
    file.mv(filepath, (err) => {
      if (err) return res.status(500).json({ status: "error", message: err });
    });

    return res.json({ status: "success", message: file.name });
  }
);

app.get("/convert", (req, res) => {
  converter();
  console.log("Done");
});

app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));

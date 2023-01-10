import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import path from "path";
import puppeteer from "puppeteer";
import csv from "csvtojson";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import filePayloadExists from "./Middleware/filePayloadExists.js";
import fileSizeLimiter from "./Middleware/fileSizeLimiter.js";

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

app.get("/convert", async (req, res) => {
  function chunk(items, size) {
    const chunks = [];
    items = [].concat(...items);

    while (items.length) {
      chunks.push(items.splice(0, size));
    }

    return chunks;
  }

  async function ConvertToPDF(url, fileName) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });

    await page.pdf({
      path: `./PDFs/${fileName}`,
      format: "A4",
      width: 1920,
      height: 1080,
      printBackground: true,
      margin: {
        top: "0.53in",
        bottom: "0.53in",
        left: "0.55in",
        right: "0.55in",
      },
    });

    await browser.close();
  }

  const filePath = "./Data/Data.csv";
  const jsonData = await csv().fromFile(filePath);
  const chunks = chunk(jsonData, 5);

  chunks.forEach((chunk) => {
    chunk.map((data) => {
      const fileName = `${data.global_id}_${data.first_name}_${data.last_name}.pdf`;
      ConvertToPDF(data.url, fileName);
    });
  });
});

app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));

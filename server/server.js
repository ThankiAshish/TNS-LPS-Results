import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import path from "path";
import puppeteer from "puppeteer";
import csv from "csvtojson";
import { fileURLToPath } from "url";
import fs from "fs";
import admz from "adm-zip";

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
      if (err) return res.json({ status: "error", message: err });
      else return res.json({ message: `${file.name} Uploaded Successfully!` });
    });
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
  const files = [];

  let file_count = 0;
  for await (const chunk of chunks) {
    for await (const data of chunk) {
      const fileName = `${data.global_id}_${data.first_name}_${data.last_name}.pdf`;
      try {
        await ConvertToPDF(data.url, fileName);
        file_count++;
      } catch (err) {
        file_count = 0;
        console.log(err);
      }
    }
  }

  if (jsonData.length === file_count)
    return res.send({
      status: "success",
      message: "File Converted Successfully!",
    });
  else
    return res.send({
      status: "error",
      message: "Try Again Later!",
    });
});

app.get("/download", async (req, res) => {
  const toZip = fs.readdirSync(__dirname + "/" + "PDFs");
  const zip = new admz();

  toZip.forEach((file) => {
    zip.addLocalFile(__dirname + "/" + "PDFs" + "/" + file);
  });

  const fileName = "Results.zip";
  zip.writeZip(__dirname + "/" + "zip" + "/" + fileName, (err) => {
    if (err) console.log(err);
  });

  fs.readdir(__dirname + "/PDfs", async (err, files) => {
    if (err) {
      console.log(err);
    } else {
      for await (const file of files) {
        fs.unlink(__dirname + `/PDFs/${file}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  });

  try {
    fs.unlink(__dirname + "/Data/Data.csv", (err) => {});
  } catch (err) {
    console.log(err);
  }

  res.download(`./zip/Results.zip`);
});

app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));

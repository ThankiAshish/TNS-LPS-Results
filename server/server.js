import express from "express";
import bodyParser from "body-parser";
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

import sendEmail from "./Helpers/sendEmail.js";
import deleteFile from "./Helpers/deleteFile.js";
import bulkDelete from "./Helpers/bulkDelete.js";

const PORT = 5000;

const app = express();
app.use(bodyParser.json())
app.use(cors());

process.on('uncaughtException', (error)  => {
  console.log('Uncaught Exception...: ',  error);
  process.exit(1);

})

process.on('unhandledRejection', (error, promise) => {
  console.log(' Promise Rejection Unhandled: ', promise);
  console.log(' The error was: ', error );
});

app.get("/", (req, res) => {
  console.log("API is Running!");
});

app.get('/_health', (req, res) => {
  res.status(200).send('ok')
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

app.post("/convert", async (req, res) => {
  console.log(req.body);
  const { flag } = req.body;

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
      timeout: 60000,
    });

    await browser.close();
  }

  const filePath = "./Data/Data.csv";
  const jsonData = await csv().fromFile(filePath);
  const chunks = chunk(jsonData, 5);

  let file_count = 0;
  let filesConverted = [];
  let filesNotConverted = [];
  let mailsSent = [];
  let mailsNotSent = [];

  for await (const chunk of chunks) {
    for await (const data of chunk) {
      const fileName = `${data.global_id}_${data.first_name}_${data.last_name}.pdf`;
      try {
        await ConvertToPDF(data.url, fileName);
        if (flag) {
          const filePath = __dirname + `\\PDFs\\${fileName}`;
          await sendEmail(data.email, fileName, filePath)
          .then(res => {
            mailsSent.push(data.email + '->' + fileName);
          }) 
          .catch(e => {
            console.log(e);
            mailsNotSent.push(data.email + '->' + fileName)
          });
        }
        filesConverted.push(data.global_id);
        file_count++;
      } catch (err) {
        console.log("here", err);
        filesNotConverted.push(data.global_id);
        if(flag) {
          mailsNotSent.push(data.email + '->' + fileName);
        }

        res.json({
          status: "error",
          message: "Something Went Wrong!",
          filesOk: filesConverted,
          filesNotOk: filesNotConverted,
          mailsOk: mailsSent,
          mailsNotOk: mailsNotSent,
          totalRows: jsonData.length,
          scannedRows: file_count,
        })
      }
    }
  }

  return res.json({
    message: `${file_count} Files Converted Successfully!`,
    filesOk: filesConverted,
    filesNotOk: filesNotConverted,
    mailsOk: mailsSent,
    mailsNotOk: mailsNotSent,
    totalRows: jsonData.length,
    scannedRows: file_count,
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

  bulkDelete(__dirname, "/PDFs");
  deleteFile(__dirname, "/Data/Data.csv");

  return res.download(`./zip/Results.zip`);
});

app.get("/reset", (req, res) => {
  bulkDelete(__dirname, "/PDFs");
  deleteFile(__dirname, "/Data/Data.csv");
  deleteFile(__dirname, "/zip/Results.zip");

  console.log("A Reset was Performed");
  
  return res.redirect("http://localhost:3000/");
})

app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));

import puppeteer from "puppeteer";
import csv from "csvtojson";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    path: `../PDFs/${fileName}`,
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

const converter = async () => {
  const filePath = "../Data/Data.csv";
  setTimeout(async () => {
    const jsonData = await csv().fromFile(filePath);
    const chunks = chunk(jsonData, 5);

    chunks.forEach((chunk) => {
      chunk.map((data) => {
        const fileName = `${data.global_id}_${data.first_name}_${data.last_name}.pdf`;
        ConvertToPDF(data.url, fileName);
      });
    }),
      1000;
  });
};

export default converter;

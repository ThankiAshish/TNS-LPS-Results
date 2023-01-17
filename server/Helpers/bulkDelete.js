import fs from "fs";
import deleteFile from "./deleteFile.js";

const bulkDelete = (dirName, dirPath) => {
    fs.readdir(dirName + dirPath, async (err, files) => {
        if (err) {
          console.log(err);
        } else {
          for await (const file of files) {
            deleteFile(dirName, `/${dirPath}/${file}`);
          }
        }
    });
}

export default bulkDelete;
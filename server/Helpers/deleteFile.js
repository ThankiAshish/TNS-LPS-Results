import fs from "fs";

const deleteFile = (dirName, path) => {
    try {
        fs.unlink(dirName + path, (err) => {});
      } catch (err) {
        console.log(err);
      }
}

export default deleteFile;
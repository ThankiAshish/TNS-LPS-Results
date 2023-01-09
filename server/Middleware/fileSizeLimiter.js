const MB = 5;
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const fileSizeLimiter = (req, res, next) => {
  const file = req.files;

  if (file.size > FILE_SIZE_LIMIT) {
    const message = `Upload Failed. ${file.name} is Over the File Size Limit of ${MB} MB`;
    return res.status(413).json({ status: "error", message });
  }

  next();
};

export default fileSizeLimiter;

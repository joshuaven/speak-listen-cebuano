const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer();
const fs = require("fs");
const path = require("path");
const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.simple()
  ),
  defaultMeta: { service: "speak-listen-cebuano" },
  transports: [
    // new transports.Console({ format: format.simple() }),
    new transports.File({ filename: "quick-start-error.log", level: "error" }),
    new transports.File({ filename: "quick-start-combined.log" })
  ]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple()
    })
  );
}

app.get("/listFiles", (req, res, next) => {
  const directoryPath = path.join(__dirname, "public/uploads");
  logger.log("info", "fetching directory: %s", "./public/uploads");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      logger.log("error", new Error("Error getting data from directory!"));
      // console.log("Error getting directory");
    } else {
      logger.info("Files loaded successfully!");
      res.send(files);
    }
  });
});

app.post("/upload", upload.single("soundBlob"), function(req, res, next) {
  console.log(req.file);

  let uploadLocation = __dirname + "/public/uploads/" + req.file.originalname;

  fs.writeFileSync(
    uploadLocation,
    Buffer.from(new Uint8Array(req.file.buffer))
  );

  logger.info("File uploaded to server successfully!");
  res.sendStatus(200);
});

logger.info("Loading HTTP files in public folder");
app.use(express.static("public"));

app.listen(3000, function() {
  logger.log("info", "app listening to port 3000");
  // console.log("app listening to port 3000");
});

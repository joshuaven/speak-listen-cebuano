const express = require("express");
const app = express();

const router = express.Router();

const multer = require("multer");
const upload = multer();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const { createLogger, format, transports } = require("winston");

const middleware = [
  express.static(path.join(__dirname, "public")),
  bodyParser.urlencoded({ extended: true })
];

app.use(middleware);

app.use("/listenLog", (req, res) => {
  console.log("accessing listen.html");
  logger.info("Navigated to listen.html");
});

app.get("/speakLog", (req, res) => {
  logger.info("Navigated to speak.html");
  speakLog.info("Initialized speak service");
  res.sendStatus(200);
});

app.get("/MicAllowed", (req, res) => {
  speakLog.info("Microphone allowed by the user");
  res.sendStatus(200);
});

app.get("/MicError", (req, res) => {
  speakLog.info(
    "Microphone errors pop out from the user unallowing them to use the service"
  );
  res.sendStatus(200);
});

app.get("/StartRecord", (req, res) => {
  speakLog.info("Microphone started recording");
  res.sendStatus(200);
});

app.get("/MediaRecordUnsupported", (req, res) => {
  speakLog.error("Record type is not supperted by the system!");
  res.sendStatus(200);
});

app.get("/ErrorMediaCreation", (req, res) => {
  speakLog.error("Exception while trying to create MediaRecorder");
  res.sendStatus(200);
});

app.get("/MediaRecordStop", (req, res) => {
  speakLog.info("Media Recording Stopped");
  res.sendStatus(200);
});

app.get("/MediaRecordStart", (req, res) => {
  speakLog.info("Media Recording Started");
  res.sendStatus(200);
});

// File Fetch Logging

app.get("filesFetchedSucc", (req, res) => {
  fileLog.info("Files successfully fetched from the server!");
  res.sendStatus(200);
});

// End of file logging

app.use((req, res, next) => {
  logger.error("File not found!");
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  // console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(3000, function() {
  // logger.log("info", "app listening to port 3000");
  // console.log("app listening to port 3000");
});

const speakLog = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.simple()
  ),
  defaultMeta: { service: "speak-service" },
  transports: [
    // new transports.Console({ format: format.simple() }),
    new transports.File({ filename: "speak-error.log", level: "error" }),
    new transports.File({ filename: "speak-start-combined.log" })
  ]
});

const fileLog = createLoggerlevel({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.simple()
  ),
  defaultMeta: { service: "speak-service" },
  transports: [
    // new transports.Console({ format: format.simple() }),
    new transports.File({ filename: "file-error.log", level: "error" }),
    new transports.File({ filename: "file-start-combined.log" })
  ]
});

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

app.post("/uploadToServer", upload.single("soundBlob"), function(
  req,
  res,
  next
) {
  let uploadLocation = __dirname + "/public/uploads/" + req.file.originalname;

  fs.writeFileSync(
    uploadLocation,
    Buffer.from(new Uint8Array(req.file.buffer))
  );

  speakLog.info("Media file successfully added");
  res.sendStatus(200);
});

// logger.info("Loading HTTP files in public folder");

// app.use(bodyParser.json());

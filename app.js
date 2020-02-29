const express = require("express");
const app = express();
const cors = require("cors");

const multer = require("multer");
const upload = multer();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const { createLogger, format, transports } = require("winston");

const speakRouter = require("./api/speak");
const listenRouter = require("./api/listen")

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
  defaultMeta: { service: "General-Service" },
  transports: [
    // new transports.Console({ format: format.simple() }),
    new transports.File({ filename: "general-service-error.log", level: "error" }),
    new transports.File({ filename: "general-service-combined.log" })
  ]
});

const middlewares = [
  express.static(path.join(__dirname, "public")),
  bodyParser.urlencoded({ extended: true }),
  cors({
    origin: "http://localhost:3000"
  }),
];

app.use(middlewares);
app.use("/speak", speakRouter);
app.use("/listen", listenRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  logger.error("%s " + err.message, statusCode);

  res.status(statusCode).json({
    type: "error",
    message: err.message
  })
});


app.listen(4000, function () {
  logger.log("info", "app listening to port 4000");
  console.log("app listening to port 4000");
});


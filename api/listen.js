const { Router } = require("express");
const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs = require("fs")

const router = new Router();

const listenLogger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.simple()
    ),
    defaultMeta: { service: "Listen-Service" },
    transports: [
        // new transports.Console({ format: format.simple() }),
        new transports.File({ filename: "Listen-service-error.log", level: "error" }),
        new transports.File({ filename: "Listen-service-combined.log" })
    ]
});

router.post('/log', (req, res) => {
    const header = req.headers
    let logType;
    let logMessage;

    var result = Object.entries(header);

    result.forEach(entry => {
        if (entry[0] == 'logtype') {
            logType = entry[1];
        }
        if (entry[0] == 'logmessage') {
            logMessage = entry[1]
        }
    });

    listenLogger.log(logType, logMessage)

    res.status(200).json({
        message: "logged to the server"
    });
})

router.get("/listFiles", (req, res, next) => {
    const directoryPath = path.join(__dirname, "../public/uploads");
    listenLogger.log("info", "fetching directory: %s", "./public/uploads");

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            listenLogger.log("error", new Error("Error getting data from directory!"));
            // console.log("Error getting directory");
        } else {
            listenLogger.info("Files loaded successfully!");
            res.send(files);
        }
    });
});


module.exports = router;

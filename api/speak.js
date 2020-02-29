const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs")
const { createLogger, format, transports } = require("winston");

const router = new Router();
const upload = multer();

const speakLogger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.simple()
    ),
    defaultMeta: { service: "Speak-Service" },
    transports: [
        // new transports.Console({ format: format.simple() }),
        new transports.File({ filename: "speak-service-error.log", level: "error" }),
        new transports.File({ filename: "speak-service-combined.log" })
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

    speakLogger.log(logType, logMessage)

    res.status(200).json({
        message: "logged to the server"
    });
})

router.post('/uploadAudio', upload.single("soundBlob"), (req, res) => {

    console.log(req.file)
    let uploadLocation = path.join(__dirname, "../public/uploads/" + req.file.originalname);
    console.log(uploadLocation)

    fs.writeFileSync(
        uploadLocation,
        Buffer.from(new Uint8Array(req.file.buffer))
    );

    let statusCode = res.statusCode // successfull

    speakLogger.info("Audio file added to server")

    res.status(statusCode).json({
        message: "Audio file added to server"
    })

    // speakLogger.info("Audio file added to server.")

})

module.exports = router;

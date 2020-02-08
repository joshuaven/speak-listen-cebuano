const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer();
const fs = require("fs");

app.post("/upload", upload.single("soundBlob"), function(req, res, next) {
  console.log(req.file);

  let uploadLocation = __dirname + "/public/uploads/" + req.file.originalname;

  fs.writeFileSync(
    uploadLocation,
    Buffer.from(new Uint8Array(req.file.buffer))
  );

  res.sendStatus(200);
});

app.use(express.static("public"));

app.listen(3000, function() {
  console.log("app listening to port 3000");
});
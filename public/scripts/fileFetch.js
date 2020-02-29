httpOption = {
  method: "GET",
  headers: new Headers()
};

let data;
const fetchURL = "listen/listFiles";

// logging
let logToServer = (logType, logMessage) => {
  myheaders = new Headers();
  myheaders.append('logType', logType);
  myheaders.append('logMessage', logMessage);
  // console.log(myheaders.get('logMessage'));
  fetch(
    '/listen/log',
    {
      method: "POST",
      headers: myheaders,
    }
  )
}

data = new Promise((resolve, reject) => {
  new p5.prototype.httpDo(
    fetchURL,
    httpOption,
    successData => {
      resolve(successData);
    },
    error => {
      reject(error);
    }
  ).then(data => {
    const parsedData = JSON.parse(data);
    if (parsedData) {
      logToServer("info", "Filenames loaded to client")
    }

    parsedData.splice(0, 1)

    const nextButton = document.getElementById("next");
    const player = document.getElementById("playFiles");
    let sentence = document.getElementById("lineNumber").innerHTML;

    let track = 0;
    player.src = "uploads/" + parsedData[track];
    let sentenceNumber = parseInt(parsedData[track].slice(0, 1));
    sentence = sentenceNumber;
    console.log(player.src);

    let { cebuano } = displaySentence(sentenceNumber)

    logToServer("info", "Sentence loaded: " + cebuano)

    nextButton.addEventListener("click", () => {
      if (track < parsedData.length - 1) {
        track++;
      } else {
        track = 0;
      }

      player.src = "uploads/" + parsedData[track];
      sentenceNumber = parseInt(parsedData[track].slice(0, 1));
      document.getElementById("lineNumber").innerHTML = sentenceNumber;

      let { cebuano } = displaySentence(sentenceNumber)

      logToServer("info", "Sentence loaded: " + cebuano)
    });
  });
});

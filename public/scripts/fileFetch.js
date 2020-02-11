httpOption = {
  method: "GET",
  headers: new Headers()
};

let data;
const fetchURL = "/listFiles";

data = new Promise((resolve, reject) => {
  new p5.prototype.httpDo(
    fetchURL,
    httpOption,
    successData => {
      resolve(successData);
      console.log(data);
    },
    error => {
      reject(error);
    }
  ).then(data => {
    const parsedData = JSON.parse(data);

    const nextButton = document.getElementById("next");
    const player = document.getElementById("playFiles");
    let sentence = document.getElementById("lineNumber").innerHTML;

    let track = 0;
    player.src = "uploads/" + parsedData[track];
    let sentenceNumber = parseInt(parsedData[track].slice(0, 1));
    sentence = sentenceNumber;
    // displaySentence(sentenceNumber);

    nextButton.addEventListener("click", () => {
      if (track < parsedData.length - 1) {
        track++;
      } else {
        track = 0;
      }

      player.src = "uploads/" + parsedData[track];
      sentenceNumber = parseInt(parsedData[track].slice(0, 1));
      document.getElementById("lineNumber").innerHTML = sentenceNumber;
      displaySentence(sentenceNumber);
    });
  });
});

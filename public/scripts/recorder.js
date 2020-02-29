// buttons and their status
let shouldStop = false;
let stopped = false;
const stopButton = document.getElementById("stop");
const recordButton = document.getElementById("record");
const audioRecord = document.getElementById("audio");
const submitButton = document.getElementById("submit");
recordButton.disabled = true;
stopButton.disabled = true;
submitButton.disabled = true;

// audio data
let blob;
let URL;

var speakURL = "/speak";

// logging
let logToServer = (logType, logMessage) => {
  myheaders = new Headers();
  myheaders.append('logType', logType);
  myheaders.append('logMessage', logMessage);
  // console.log(myheaders.get('logMessage'));
  fetch(
    speakURL + '/log',
    {
      method: "POST",
      headers: myheaders,
    }
  )
}

//form submission
let p5Mods;

//audio title
let lineNumber;
let date = Date.now();

submitButton.addEventListener("click", () => {
  lineNumber = document.getElementById("lineNumber").innerHTML;
  let title = lineNumber + "-" + date;

  let formdata = new FormData();
  formdata.append("soundBlob", blob, title + ".wav");
  console.log(formdata);

  var httpRequestOption = {
    method: "POST",
    body: formdata,
    headers: new Headers({
      enctype: "multipart/form-data"
    })
  };

  p5Mods = new p5.prototype.httpDo(
    speakURL + "/uploadAudio",
    httpRequestOption,
    successStatusCode => {
      console.log(successStatusCode)
    },
    error => {
      console.log(error);
    }
  );
  submitButton.disabled = true;

  logToServer("info", "User exits on this service")
});

stopButton.addEventListener("click", function () {
  stopRecording();
  audioRecord.src = url;
  console.log(audioRecord);
});

recordButton.addEventListener("click", () => {
  startRecording();
});

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  logToServer("info", "Started Recording")

  recordedBlobs = [];
  let options = {
    mimeType: "audio/webm"
  };

  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    logToServer("error", options.mimeType + " is not supported")
  }

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (error) {
    logToServer("error", "Exception in creating MediaRecorder: " + error)
    console.error("Exception while trying to create MediaRecorder: ", error)
    return;
  }

  console.log("Created MediaRecord", mediaRecorder, "with options", options);
  recordButton.disabled = true;

  mediaRecorder.onStop = event => {
    console.log("Recorder stopped: ", event);
    console.log("Recorded Blobs: ", recordedBlobs);
  };

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(10);
  logToServer("info", "Media recorder started")
  stopButton.disabled = false;
}

function stopRecording() {
  logToServer("info", "Media recorder stopped")
  console.log("MediaRecorder stopped");
  window.stream.getTracks()[0].stop();
  mediaRecorder.stop();

  blob = new Blob(recordedBlobs, { type: "audio/webm" });
  url = window.URL.createObjectURL(blob);

  stopButton.disabled = true;
  submitButton.disabled = false;
}

const handleSuccess = function (stream) {
  newSentence();
  recordButton.disabled = false;
  window.stream = stream;

  logToServer("info", "Mic allowed by the user");

  console.log("getUserMedia() got stream", stream);
};

function handleError(error) {
  logToServer("error", error.message)
  console.log(
    error.message,
    error.name
  );

}

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: false
  })
  .then(handleSuccess)
  .catch(handleError);

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

//form submission
let p5Mods;
let logToServer;

//audio title
let lineNumber;
let date = Date.now();

submitButton.addEventListener("click", () => {
  lineNumber = document.getElementById("lineNumber").innerHTML;
  let title = lineNumber + "-" + date;

  let formdata = new FormData();
  formdata.append("soundBlob", blob, title + ".wav");
  console.log(formdata);

  var serverURL = "/uploadToServer";

  var httpRequestOption = {
    method: "POST",
    body: formdata,
    headers: new Headers({
      enctype: "multipart/form-data"
    })
  };

  p5Mods = new p5.prototype.httpDo(
    serverURL,
    httpRequestOption,
    successStatusCode => {
      console.log(successStatusCode)
    },
    error => {
      console.log(error)
    }
  );
  submitButton.disabled = true;
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
  fetch('/StartRecord').then(() => {
    console.log("Started Recording");
  })

  recordedBlobs = [];
  let options = {
    mimeType: "audio/webm"
  };

  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    fetch('/MediaRecordUnsupported').then(() => console.error(options.mimeType + "is not supported"))
  }

  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (error) {
    fetch('/ErrorMediaCreation').then(() => console.error("Exception while trying to create MediaRecorder: ", error))
    return;
  }

  console.log("Created MediaRecord", mediaRecorder, "with options", options);
  recordButton.disabled = true;

  mediaRecorder.onStop = event => {
    fetch('/MediaRecordStop').then(() => {
      console.log("Recorder stopped: ", event);
      console.log("Recorded Blobs: ", recordedBlobs);
    })
  };

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(10);
  fetch('/MediaRecordStart').then(() => {
    console.log("MediaRecorder started", mediaRecorder);
  })
  stopButton.disabled = false;
}

function stopRecording() {
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
  fetch('/MicAllowed').then(() => {
    console.log("getUserMedia() got stream", stream);
  })
};

function handleError(error) {
  console.log(
    "navigator.MediaDevices.getUserMedia error: ",
    error.message,
    error.name
  );

  fetch('/MicError')
}

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: false
  })
  .then(handleSuccess)
  .catch(handleError);

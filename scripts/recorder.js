let shouldStop = false;
let stopped = false;
const downloadButton = document.getElementById('download');
const stopButton = document.getElementById('stop');
const recordButton = document.getElementById('record')
recordButton.disabled = true;
stopButton.disabled = true;
downloadButton.disabled = true;

downloadButton.addEventListener('click', () => {
    const blob = new Blob(recordedBlobs);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild('a');
        window.URL.revokeObjectURL(url);
    }, 100);
})

stopButton.addEventListener('click', function () {
    stopRecording();
});

recordButton.addEventListener('click', () => {
    startRecording();
})

function handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function startRecording() {
    console.log("Started Recording");

    recordedBlobs = []
    let options = {
        mimeType: 'audio/webm'
    }

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(options.mimeType + 'is not supported')
    }

    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (error) {
        console.error('Exception while trying to create MediaRecorder: ', error)
        return;
    }

    console.log('Created MediaRecord', mediaRecorder, 'with options', options);
    recordButton.disabled = true;


    mediaRecorder.onStop = (event) => {
        console.log('Recorder stopped: ', event);
        console.log('Recorded Blobs: ', recordedBlobs);
    };

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10);
    console.log("MediaRecorder started", mediaRecorder);
    stopButton.disabled = false;
}

function stopRecording() {
    console.log("MediaRecorder stopped");
    mediaRecorder.stop();
    stopButton.disabled = true;
    downloadButton.disabled = false;
}

const handleSuccess = function (stream) {
    recordButton.disabled = false;
    window.stream = stream;
    console.log("getUserMedia() got stream", stream);
};

function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    })
    .then(handleSuccess).catch(handleError);

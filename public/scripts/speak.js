let logSpeak = () => {
    console.log("loaded")
    fetch('/speakLog').then(res => {
        console.log(res);
    })
}

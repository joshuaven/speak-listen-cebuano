let logListen = () => {
    console.log("listen loaded")
    fetch('/listenLog').then(res => {
        console.log("listen loaded using API");
    })
}

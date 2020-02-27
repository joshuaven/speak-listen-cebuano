const listenButton = document.getElementById('listenbutton');

listenButton.addEventListener('click', () => {
    console.log('listenkeypress')
    fetch('/listen').then(res => { console.log("accessed listen.hjtml") })
})

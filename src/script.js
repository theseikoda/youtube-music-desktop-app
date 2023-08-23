let current_song = { title: "", author: "", image: "" };

let playerBar;

let waitForPlayerBar = setInterval(() => {

    if (document.querySelector("ytmusic-player-bar")) {
        playerBar = document.querySelector("ytmusic-player-bar");

        startSongAnalyzerLoop();

        clearInterval(waitForPlayerBar);
    }

}, 1000)

function sendSongData(song) {
    const invoke = window.__TAURI__.invoke;
    invoke('on_new_song_playing', { "song": { song } });
}

function startSongAnalyzerLoop() {

    let songAnalyzerLoop = setInterval(() => {

        if (playerBar.querySelector(".title").innerText) {

            let song = {
                title: playerBar.querySelector(".title").innerText,
                author: playerBar.querySelectorAll("a")[0].innerText,
                image: playerBar.querySelector(".image").src,
            };

            if (song.title === current_song.title && song.author === current_song.author && song.image === current_song.image) {
                return;
            }

            sendSongData(song);
            current_song = song;
            console.log(`New song playing: ${song.title} by ${song.author}`);
        }

    }, 2000);

}
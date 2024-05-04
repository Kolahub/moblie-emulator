import { allAppScreen, allApps } from "../index.js";
const music = document.querySelector(".music");
const musicBtn = document.querySelector(".musicBtn");
const musicBack = document.querySelector(".music-back");
const musicDegree = document.querySelector(".music-degree");
const musicPlayingInfo = document.querySelector(".music-playing-info");
const volumeControl = document.querySelector("#volume-control");
const decreaseVolumeButton = document.querySelector(".toggleBtn-volumeLower");
const increaseVolumeButton = document.querySelector(".toggleBtn-volumeHigher");
const volumePercentageSpan = document.querySelector("#volume-percentage");
const allMusic = document.querySelector(".allMusic");
let currentlyPlayingMusic = null;
let htmlData = "";
let musicSong;
let timer;
let musicArr = [
  {
    name: "Soundgasm",
    artist: "Rema",
    imgurl: "../img/Rema-–-Soundgasm.jpg",
    audiourl: "../audio/Rema-Soundgasm-(TrendyBeatz..com).mp3",
  },

  {
    name: "Dangote",
    artist: "Burna Boy",
    imgurl: "../img/BurnaBoy_African_Giant.jpg",
    audiourl: "../audio/Burna-Boy-Dangote-[TrendyBeatz.com].mp3",
  },

  {
    name: "Dull",
    artist: "Asake",
    imgurl: "../img/asakealbum.jpg",
    audiourl: "../audio/Asake-Dull-(TrendyBeatz.com).mp3",
  },

  {
    name: "Calm Down",
    artist: "Rema",
    imgurl: "../img/calmdown.jpeg",
    audiourl: "../audio/Rema-Calm-Down-(TrendyBeatz.com).mp3",
  },

  {
    name: "Lonely at the Top",
    artist: "Asake",
    imgurl: "../img/lonleyATT.jpg",
    audiourl: "../audio/Asake-Lonely-At-The-Top-(TrendyBeatz.com).mp3",
  },

  {
    name: "Charm",
    artist: "Rema",
    imgurl: "../img/calmdown.jpeg",
    audiourl: "../audio/Rema-Charm-(TrendyBeatz.com).mp3",
  },

  {
    name: "No Stress",
    artist: "Wizkid",
    imgurl: "../img/madeIL.jpg",
    audiourl: "../audio/Rema-Charm-(TrendyBeatz.com).mp3",
  },

  {
    name: "Sungba",
    artist: "Asake",
    imgurl: "../img/asakealbum.jpg",
    audiourl: "../audio/Asake-Sungba-(TrendyBeatz.com).mp3",
  },

  {
    name: "Woman",
    artist: "Rema",
    imgurl: "../img/womanrema.jpeg",
    audiourl: "../audio/Rema-Woman.mp3",
  },
];

function allMusicHtml() {
  musicArr.forEach((el) => {
    htmlData += `<div class="song">
        <img src=${el.imgurl} alt="" class="song-img">
        <p class="song-name">${el.artist}, ${el.name}</p>
        <div class="toggle-play" data-music='${el.audiourl}'>
        <img src="img/play-circle-fill.svg" alt="" class="play">
        <img src="img/pause-circle-fill.svg" alt="" class="pause hidden">
        </div>
      </div>`;
  });

  allMusic.innerHTML = htmlData;

  allMusic.addEventListener("click", function (e) {
    if (e.target.classList.contains("play")) {
      const audio = e.target.closest(".toggle-play");
      const songName = audio.previousElementSibling;
      musicPlayingInfo.textContent = `${songName.textContent} is playing now.`;
      console.log(audio.dataset.music);

      if (currentlyPlayingMusic) {
        const [oldAudio, previousTar, siblingsTar] = currentlyPlayingMusic;
        oldAudio.pause();
        previousTar.classList.toggle("hidden");
        siblingsTar.classList.toggle("hidden");
      }

      musicSong = new Audio(`${audio.dataset.music}`);
      setInitialVolume(); // Set initial volume when musicSong is initialized
      e.target.classList.toggle("hidden");
      e.target.nextElementSibling.classList.toggle("hidden");
      musicSong.play();
      currentlyPlayingMusic = [
        musicSong,
        e.target,
        e.target.nextElementSibling,
      ];
    }

    if (e.target.classList.contains("pause")) {
      e.target.classList.toggle("hidden");
      e.target.previousElementSibling.classList.toggle("hidden");
      musicSong.pause();
      currentlyPlayingMusic = null;
      musicPlayingInfo.textContent = `No music is played yet.`;
    }
    volumeControlComp();
  });
}

function volumeControlComp() {
  decreaseVolumeButton.addEventListener("click", function () {
    musicDegree.classList.remove("hidden");
    clearTimeout(timer);
    timer = setTimeout(() => {
      musicDegree.classList.add("hidden");
    }, 3000);

    if (musicSong.volume > 0.1) {
      musicSong.volume -= 0.1;
    } else {
      musicSong.volume = 0; // Set volume to 0 if it becomes less than 0.1
    }
    updateVolumeDisplay();
  });

  increaseVolumeButton.addEventListener("click", function () {
    musicDegree.classList.remove("hidden");
    clearTimeout(timer);
    timer = setTimeout(() => {
      musicDegree.classList.add("hidden");
    }, 3000);
    if (musicSong.volume < 1) {
      musicSong.volume += 0.1;
      updateVolumeDisplay();
    }
  });

  volumeControl.addEventListener("input", function (e) {
    musicSong.volume = e.currentTarget.value / 100;
    updateVolumeDisplay();
  });
}

// Set initial volume control based on musicSong volume
function setInitialVolume() {
  if (musicSong) {
    const volumePercentage = Math.round(musicSong.volume * 100);
    volumePercentageSpan.textContent = volumePercentage + "%";
    volumeControl.value = volumePercentage;
  }
}

// Update volume display based on musicSong volume
function updateVolumeDisplay() {
  if (musicSong) {
    const volumePercentage = Math.round(musicSong.volume * 100);
    volumePercentageSpan.textContent = volumePercentage + "%";
    volumeControl.value = volumePercentage;
  }
}

export function musicInit() {
  allMusicHtml();

  musicBtn.addEventListener("click", function () {
    music.classList.remove("hidden");
    allAppScreen.classList.add("hidden");
    allApps.classList.add("hidden");
  });

  musicBack.addEventListener("click", function () {
    music.classList.add("hidden");
    allAppScreen.classList.remove("hidden");
    allApps.classList.remove("hidden");
    musicSong.pause();
    document.querySelector(".play").classList.toggle("hidden");
    document.querySelector(".pause").classList.toggle("hidden");
  });
}

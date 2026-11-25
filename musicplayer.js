const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const playingSong = document.getElementById("player-song-title");
const songArtist = document.getElementById("player-song-artist");
const progressBar = document.getElementById("progress-bar");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");
const volumeSlider = document.getElementById("volume-slider");

const allSongs = [
  {
    id: 0,
    title: "Mawlaya",
    artist: "Maher Zain",
    duration: "0:00",
    src: "https://cdn.jsdelivr.net/gh/iamaanahmad/NasheedCollection@master/Maher%20Zain%20-%20Mawlaya%20-%20Vocals%20Only%20Version%20%28No%20Music%29.mp3",
  },
  {
    id: 1,
    title: "Ya Nabi Salam Alayka",
    artist: "Maher Zain",
    duration: "0:00",
    src: "https://cdn.jsdelivr.net/gh/iamaanahmad/NasheedCollection@master/Maher%20Zain%20-%20Ya%20Nabi%20Salam%20Alayka%20%28International%20Version%29%20l%20Vocals%20Only%20%28No%20Music%29.mp3",
  },
  {
  id: 2,
  title: "Kun Anta",
  artist: "Humood Alkhudher",
  duration: "4:01",
  src: "https://nairaflaver.com/wp-content/uploads/2025/02/Humood-Kun-Anta-Nairaflaver-Songs.mp3"
},
  {
    id: 3,
    title: "Benevolent Rain",
    artist: "Muhammad al Muqit",
    duration: "0:00",
    src: "https://cdn.jsdelivr.net/gh/iamaanahmad/NasheedCollection@master/Muhammad%20al%20Muqit%20-%20Benevolent%20Rain.mp3",
  },
{
  id: 4,
  title: "For The Rest Of My Life",
  artist: "Maher Zain",
  duration: "3:54",
  src: "https://cds.gaaliaan.xyz/wp-content/uploads/2025/05/Maher-Zain---For-The-Rest-Of-My-Life.mp3",
},
];


const audio = new Audio();

const formatTime = (time) => {
  if (!Number.isFinite(time)) return "0:00";

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const userData = {
  songs: allSongs,
  currentSong: null,
  songCurrentTime: 0,
};

const playSong = (id) => {
  const song = userData.songs.find((song) => song.id === id);

  audio.src = song.src;
  audio.title = song.title;

  userData.currentSong = song;
  userData.songCurrentTime = 0;

  playButton.classList.add("playing");

  progressBar.value = 0;
  currentTimeDisplay.textContent = "0:00";
  durationDisplay.textContent = "0:00";

  setPlayerDisplay();
  highlightCurrentSong();
  setPlayButtonAccessibleText();

  audio.play();
};

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  playButton.classList.remove("playing");
  audio.pause();
};

const getCurrentSongIndex = () => userData.songs.indexOf(userData.currentSong);

const getNextSong = () => userData.songs[getCurrentSongIndex() + 1];

const getPreviousSong = () => userData.songs[getCurrentSongIndex() - 1];

const playPreviousSong = () => {
  if (userData.currentSong === null) return;
  const previousSong = getPreviousSong();
  if (previousSong) {
    playSong(previousSong.id);
  } else {
    playSong(userData.songs[0].id);
  }
};

 const playNextSong = () => {
  if (userData.currentSong === null) {
    playSong(userData.songs[0].id);
    return;
  }

  const nextSong = getNextSong();

  if (nextSong) {
    playSong(nextSong.id);
  } else {
    audio.pause();
    audio.currentTime = 0;

    userData.currentSong = null;
    userData.songCurrentTime = 0;

    playButton.classList.remove("playing");

    progressBar.value = 0;
    currentTimeDisplay.textContent = "0:00";
    durationDisplay.textContent = "0:00";

    setPlayerDisplay();
    highlightCurrentSong();
    setPlayButtonAccessibleText();
  }
};

const setPlayerDisplay = () => {
  const currentTitle = userData.currentSong?.title;
  const currentArtist = userData.currentSong?.artist;

  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

const highlightCurrentSong = () => {
  const previousCurrentSong = document.querySelector('.playlist-song[aria-current="true"]');
  previousCurrentSong?.removeAttribute("aria-current");
  const songToHighlight = document.getElementById(
    `song-${userData.currentSong?.id}`
  );
  
  songToHighlight?.setAttribute("aria-current", "true");
};

const setPlayButtonAccessibleText = () => {
  const song = userData.currentSong;
  playButton.setAttribute("aria-label", userData.currentSong ? `Play ${song.title}` : "Play");
};

playButton.addEventListener("click", () => {
  if (userData.currentSong === null) {
    playSong(userData.songs[0].id);
  } else {
    audio.play();
    playButton.classList.add("playing");
  }
});

const songs = document.querySelectorAll(".playlist-song");

songs.forEach((song) => {
  const id = song.getAttribute("id").slice(5);
  const songBtn = song.querySelector("button");
  songBtn.addEventListener("click", () => {
    playSong(Number(id));
  });
});

pauseButton.addEventListener("click", pauseSong);

nextButton.addEventListener("click", playNextSong);

previousButton.addEventListener("click", playPreviousSong);

audio.addEventListener("ended", playNextSong);

audio.addEventListener("loadedmetadata", () => {
  durationDisplay.textContent = formatTime(audio.duration);
  progressBar.value = 0;
  currentTimeDisplay.textContent = "0:00";
});

audio.addEventListener("timeupdate", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    const progress = (audio.currentTime / audio.duration) * 100;

    progressBar.value = progress;

    currentTimeDisplay.textContent = formatTime(audio.currentTime);
  }
});

progressBar.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value / 100;
}); 

audio.addEventListener("error", () => {
  console.log("Unable to load this song. Please try another one.");
});
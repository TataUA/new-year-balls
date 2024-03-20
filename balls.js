let context = null;
let buffer = null;
let balls = null;
let preset = 0;
const audioFilesPaths = [
  "./music/sound1.mp3",
  "./music/sound2.mp3",
  "./music/sound3.mp3",
  "./music/sound4.mp3",
  "./music/sound5.mp3",
  "./music/sound6.mp3",
  "./music/sound7.mp3",
  "./music/sound8.mp3",
  "./music/sound9.mp3",
  "./music/sound10.mp3",
  "./music/sound11.mp3",
  "./music/sound12.mp3",
  "./music/sound13.mp3",
  "./music/sound14.mp3",
  "./music/sound15.mp3",
  "./music/sound16.mp3",
  "./music/sound17.mp3",
  "./music/sound18.mp3",
  "./music/sound19.mp3",
  "./music/sound20.mp3",
  "./music/sound21.mp3",
  "./music/sound22.mp3",
  "./music/sound23.mp3",
  "./music/sound24.mp3",
  "./music/sound25.mp3",
  "./music/sound26.mp3",
  "./music/sound27.mp3",
  "./music/sound28.mp3",
  "./music/sound29.mp3",
  "./music/sound30.mp3",
  "./music/sound31.mp3",
  "./music/sound32.mp3",
  "./music/sound33.mp3",
  "./music/sound34.mp3",
  "./music/sound35.mp3",
  "./music/sound36.mp3",
];

class Balls {
  constructor(context, buffer) {
    this.context = context;
    this.buffer = buffer;
  }

  setup() {
    this.gainNode = this.context.createGain();
    this.source = this.context.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    this.gainNode.gain.setValueAtTime(1, this.context.currentTime);
  }

  play() {
    this.setup();
    this.source.start(this.context.currentTime);
  }

  stop() {
    const ct = this.context.currentTime + 1;
    this.gainNode.gain.exponentialRampToValueAtTime(0.1, ct);
    this.source.stop(ct);
  }
}

class Buffer {
  constructor(audioFiles) {
    this.audioFiles = audioFiles;
    this.sounds = [];
  }

  async loadAudioFiles() {
    try {
      for (const audioPath of this.audioFiles) {
        const sound = new Howl({
          src: [audioPath],
          preload: true,
          onload: () => {
            console.log(`Audio file ${audioPath} loaded`);
          },
          onloaderror: (error) => {
            console.error(`Error loading audio file ${audioPath}:`, error);
          },
        });
        this.sounds.push(sound);
      }

      this.loaded();
    } catch (error) {
      console.error("Error loading audio files:", error);
    }
  }

  loaded() {
    console.log("All audio files loaded");
  }

  getAudioBuffer(index) {
    return this.sounds[index];
  }
}

async function loadAudioFiles(audioFilesPaths) {
  const audioBuffers = [];

  for (const audioPath of audioFilesPaths) {
    try {
      const response = await fetch(audioPath);
      const arrayBuffer = await response.arrayBuffer();
      audioBuffers.push(arrayBuffer);
    } catch (error) {
      console.error(`Error loading audio file ${audioPath}:`, error);
    }
  }
  return audioBuffers;
}

async function init() {
  try {
    context = new AudioContext();
    buffer = new Buffer(audioFilesPaths);
    await buffer.loadAudioFiles();
  } catch (error) {
    console.error("Error initializing audio context:", error);
  }
}

function playBalls(index) {
  if (!buffer || index < 0 || index >= buffer.sounds.length) return;
  if (balls && balls.playing()) {
    balls.stop();
  }
  balls = buffer.getAudioBuffer(index);
  if (balls) {
    balls.play();
  }
}

function stopBalls() {
  if (balls) {
    balls.stop();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", init);
});

const elementsWithDataNote = document.querySelectorAll("[data-note]");

elementsWithDataNote.forEach((element) => {
  element.addEventListener("mouseover", function (event) {
    const index = parseInt(event.target.dataset.note) + preset;
    playBalls(index);
  });
});
function ballBounce(e) {
  let i = e;
  if (e.className.indexOf(".bounce") > -1) {
    return;
  }
  toggleBounce(i);
}

function toggleBounce(i) {
  i.classList.add("bounce");
  function n() {
    i.classList.remove("bounce");
    i.classList.add("bounce1");
    function o() {
      i.classList.remove("bounce1");
      i.classList.add("bounce2");
      function p() {
        i.classList.remove("bounce2");
        i.classList.add("bounce3");
        function q() {
          i.classList.remove("bounce3");
        }
        setTimeout(q, 300);
      }
      setTimeout(p, 300);
    }
    setTimeout(o, 300);
  }
  setTimeout(n, 300);
}

let array1 = document.querySelectorAll(".ball_bounce");
let array2 = document.querySelectorAll(".ball_bounce .ball_right");

for (let i = 0; i < array1.length; i++) {
  array1[i].addEventListener("mouseenter", function () {
    ballBounce(this);
    const index = parseInt(this.dataset.note) + preset;
    playBalls(index);
  });
}

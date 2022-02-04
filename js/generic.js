class AudioMeta {
  id;
  isPlaying = false;
  button;
  audio;
  options;
  constructor(id) {
    this.id = id;
    this.init();
  }

  play() {
    console.log("Playing '" + this.id + "'");
    this.audio.play();
  }

  stop() {
    console.log("Stopping '" + this.id + "'");
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  getMsLeft() {
    return 1000 * (this.audio.duration - this.audio.currentTime);
  }

  init() {
    console.log("Binding '" + this.id + "'");

    // DOM elements
    const container = document.getElementById(this.id);
    this.button = container.querySelector("button");
    this.audio = container.querySelector("audio");

    // STATE TRANSITIONS by Events
    this.audio.addEventListener("ended", () => {
      this.isPlaying = false;
      this.button.classList.remove("playing");
    });
    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.button.classList.remove("playing");
    });
    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.button.classList.add("playing");
    });
  }
}

class StoppableAudio extends AudioMeta {
  init() {
    super.init();
    this.button.addEventListener("click", () => {
      if (!this.isPlaying) {
        return this.play();
      } else {
        return this.stop();
      }
    });
  }
}

class SoundEffect extends AudioMeta {
  init() {
    super.init();
    this.button.classList.add("reset");
    this.button.addEventListener("click", () => {
      this.audio.currentTime = 0;
      return this.play();
    });
  }
}

// Latency between telling to use the 'loop-out' and the predicted start of the soundfile.
// Higher Value means earlier Start of 'loop-out'
const playLatencyMs = 250;

class QuitableLoop {

  loopAudioMeta;
  endAudioMeta;

  exitTimeout;

  constructor(loopSelector, endSelector) {
    this.loopAudioMeta = new AudioMeta(loopSelector);
    this.endAudioMeta = new AudioMeta(endSelector);
    this.init();
  }

  init() {
    this.loopAudioMeta.button.addEventListener("click", () => {
      this.startLoop();
    });
    this.endAudioMeta.button.addEventListener("click", () => {
      this.exitLoopAndEnd();
    });
  }

  startLoop() {
    this.endAudioMeta.stop();
    this.loopAudioMeta.audio.loop = true;
    this.loopAudioMeta.play();
  }

  stop() {
    this.endAudioMeta.stop();
    this.loopAudioMeta.stop();
  }

  exitLoopAndEnd() {
    this.loopAudioMeta.audio.loop = false;
    this.endAudioMeta.audio.currentTime = 0;
    if (this.exitTimeout) {
      clearTimeout(this.exitTimeout);
    }
    const startIn = this.loopAudioMeta.getMsLeft() - playLatencyMs;
    this.exitTimeout = setTimeout(() => {
      this.endAudioMeta.audio.currentTime = 0;
      this.endAudioMeta.play();
      this.loopAudioMeta.stop();
      clearTimeout(this.exitTimeout);
    }, startIn)
  }
}

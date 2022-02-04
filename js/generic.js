class AudioOptions {
  isSfx = true;
}

class AudioMeta {
  id;
  isRunning = false;
  button;
  audio;
  options;
  constructor(id, options) {
    this.id = id;
    this.options = options ? options : new AudioOptions();
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

  init() {
    console.log("Binding '" + this.id + "'");

    // DOM elements
    const container = document.getElementById(this.id);
    this.button = container.querySelector("button");
    this.audio = container.querySelector("audio");

    // add CLASSES by options
    if (this.options.isSfx) {
      this.button.classList.add("reset");
    }

    // STATE TRANSITIONS by Events
    this.audio.addEventListener("ended", () => {
      this.isRunning = false;
      this.button.classList.remove("playing");
    });
    this.audio.addEventListener("pause", () => {
      this.isRunning = false;
      this.button.classList.remove("playing");
    });
    this.audio.addEventListener("play", () => {
      this.isRunning = true;
      this.button.classList.add("playing");
    });

    // ACTIONS
    this.button.addEventListener("click", () => {
      if (this.options.isSfx) {
        this.audio.currentTime = 0;
        return this.play();
      }
      if (!this.isRunning) {
        return this.play();
      } else {
        return this.stop();
      }
    });
  }
}

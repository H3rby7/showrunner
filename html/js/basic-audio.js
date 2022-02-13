// ***************** SOUND/MUSIC *****************

function createSoundEffectNode(root, withTimeline) {
  let playing = false;

  const src = root.attributes.src.value;
  const type = root.attributes.type.value;
  const loop = root.attributes.loop;

  const btn = DOMcreatePlayButton();

  const audio = DOMcreateAudio(src, type, loop);
  const controls = DOMcreateAudioControls();

  if (withTimeline) {
    const timeline = DOMcreateTimeline(audio);
    controls.appendChild(timeline);
  }

  root.appendChild(btn);
  root.appendChild(audio);
  root.appendChild(controls);

  linkControls();

  if (root.attributes.reset) {
    makeResetable();
  } else {
    makeStoppable();
  }

  return root;

  function makeResetable() {
    btn.classList.add("reset");
    btn.addEventListener("click", () => {
      audio.currentTime = 0;
      audio.play();
    });
  }
  
  function makeStoppable() {
    btn.addEventListener("click", () => {
      if (playing) {
        audio.currentTime = 0;
        audio.pause();
      } else {
        audio.play();
      }
    });
  }

  function linkControls() {
    // STATE TRANSITIONS by Events
    audio.addEventListener("ended", () => {
      playing = false;
      btn.classList.remove("playing");
    });
    audio.addEventListener("pause", () => {
      playing = false;
      btn.classList.remove("playing");
    });
    audio.addEventListener("play", () => {
      playing = true;
      btn.classList.add("playing");
    });
  }
}

// ***************** GENERICS *****************

function DOMcreatePlayButton() {
  const btn = document.createElement("button");
  btn.classList.add("audio-control");
  btn.classList.add("play");
  return btn;
}

function DOMcreateAudio(src, type, loop) {
  const audio = document.createElement("audio");
  audio.classList.add("custom-audio");
  audio.src = src;
  audio.type = type;
  audio.preload = "auto";
  if (loop) audio.loop = true;
  return audio;
}

function DOMcreateAudioControls() {
  const div = document.createElement("div");
  div.classList.add("audio-controls");
  return div;
}

function DOMcreateTimeline(audio) {

  const timeline = document.createElement("input");
  timeline.id = "audioTimeline-" + makeid(5);
  timeline.classList.add("audio-timeline");
  timeline.autocomplete = false;
  timeline.type = "range";
  timeline.value = 0;

  // Setup Timeline using audio duration
  audio.addEventListener("loadedmetadata", () => {
    timeline.max = audio.duration;
    timeline.step = audio.duration / 1000;
  }, {once: true});

  // Link Audio and Timeline
  timeline.addEventListener("change", ({target: {value}}) => {
    audio.currentTime = value;
  });
  audio.addEventListener("timeupdate", ({target: {currentTime}}) => {
    timeline.value = currentTime;
  });

  return timeline;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("sound-effect")
    .forEach((el) => createSoundEffectNode(el, false));
}, {once: true});
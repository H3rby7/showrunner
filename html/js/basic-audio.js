// ***************** SOUND/MUSIC *****************

function createSoundEffectNode(root) {
  let playing = false;

  const src = root.attributes.src.value;
  const type = root.attributes.type.value;
  const resetting = root.attributes.reset;
  const loop = root.attributes.loop;

  const btn = document.createElement("button");
  btn.innerHTML = root.innerHTML;
  btn.classList.add("audio-control");
  btn.classList.add("play");
  root.innerHTML = "";

  const audio = DOMcreateAudio(src, type, loop);

  root.appendChild(btn);
  root.appendChild(audio);
  audioControls(audio);

  linkControls(root, btn, audio);
  if (resetting) {
    makeResetable(btn, audio);
  } else {
    makeStoppable(btn, audio);
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
        audio.pause();
      } else {
        audio.currentTime = 0;
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

function DOMcreateAudio(src, type, loop) {
  const audio = document.createElement("audio");
  audio.classList.add("custom-audio");
  audio.src = src;
  audio.type = type;
  audio.preload = "auto";
  audio.controls = true;
  if (loop) audio.loop = true;
  return audio;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("sound-effect")
    .forEach(createSoundEffectNode);
}, {once: true});

function audioControls(audio) {
  const div = document.createElement("div");
  div.classList.add("audio-controls");

  const timeline = document.createElement("input");
  timeline.id = "audioTimeline-" + makeid(1);
  timeline.classList.add("audio-timeline");
  timeline.autocomplete = false;
  timeline.type = "range";
  timeline.value = 0;
  timeline.step = 0.1;
  audio.addEventListener("loadedmetadata", () => {
    timeline.max = audio.duration;
  }, {once: true});

  div.appendChild(timeline);

  audio.parentNode.appendChild(div);

  audio.controls = undefined;
  timeline.addEventListener("change", ({target: {value}}) => {
    audio.currentTime = value;
  });
  audio.addEventListener("timeupdate", ({target: {currentTime}}) => {
    timeline.value = currentTime;
  });
}
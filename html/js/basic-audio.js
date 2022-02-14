// ***************** SOUND/MUSIC *****************

function createSoundEffectNode(root, withTimeline) {
  const audio = DOMcreateAudio(root.attributes.src.value, root.attributes.type.value, root.attributes.loop);
  const btn = DOMcreatePlayButton(audio, root.attributes.reset);
  const controls = DOMcreateAudioControls();

  controls.appendChild(btn);

  if (withTimeline || root.attributes.timeline) {
    const timeline = DOMcreateTimeline(audio);
    controls.appendChild(timeline);
  }

  root.appendChild(DOMcreateAudioLabel(root.attributes.label.value));
  root.appendChild(audio);
  root.appendChild(controls);

  return root;
}

// ***************** GENERICS *****************

function DOMcreateAudioLabel(text) {
  const label = document.createElement("div");
  label.classList.add("audio-label");
  label.innerHTML = text;
  return label;
}

function DOMcreatePlayButton(audio, resetable) {
  let playing = false;
  const btn = document.createElement("button");
  btn.classList.add("audio-control");
  btn.classList.add("play");
  if (resetable) {
    btn.classList.add("reset");
  }

  btn.addEventListener("click", () => {
    if (resetable) {
      audio.currentTime = 0;
      audio.play();
    }
    if (playing) {
      audio.currentTime = 0;
      audio.pause();
    } else {
      audio.play();
    }
  });

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
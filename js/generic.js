function DOMrenderSoundEffect() {
  document.querySelectorAll("sound-effect").forEach(el => {
    const content = createSoundEffectNode(el);
    el.innerHTML = "";
    el.appendChild(content);
  });
}

function createSoundEffectNode(root) {
  root.playing = false;

  const src = root.attributes.src.value;
  const type = root.attributes.type.value;
  const resetting = root.attributes.reset;
  const loop = root.attributes.loop;

  const div = document.createElement("div");
  div.classList.add("audio-group");

  const btn = document.createElement("button");
  btn.innerHTML = root.innerHTML;

  const audio = DOMcreateAudio(src, type, loop);

  div.appendChild(btn);
  div.appendChild(audio);

  linkControls(root, btn, audio);
  if (resetting) {
    makeResetable(btn, audio);
  } else {
    makeStoppable(btn, audio);
  }

  return div;

  function makeResetable() {
    btn.classList.add("reset");
    btn.addEventListener("click", () => {
      audio.currentTime = 0;
      audio.play();
    });
  }
  
  function makeStoppable() {
    btn.addEventListener("click", () => {
      if (root.playing) {
        audio.pause();
      } else {
        audio.currentTime = 0;
        audio.play();
      }
    });
  }
}

function DOMcreateAudio(src, type, loop) {
  const audio = document.createElement("audio");
  audio.src = src;
  audio.type = type;
  audio.preload = "audo";
  audio.controls = true;
  if (loop) audio.loop = true;
  return audio;
}

function linkControls(parent, btn, audio) {
  // STATE TRANSITIONS by Events
  audio.addEventListener("ended", () => {
    parent.playing = false;
    btn.classList.remove("playing");
  });
  audio.addEventListener("pause", () => {
    parent.playing = false;
    btn.classList.remove("playing");
  });
  audio.addEventListener("play", () => {
    parent.playing = true;
    btn.classList.add("playing");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  DOMrenderSoundEffect();
});

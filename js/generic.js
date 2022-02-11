function createSoundEffectNode(root) {
  let playing = false;

  const src = root.attributes.src.value;
  const type = root.attributes.type.value;
  const resetting = root.attributes.reset;
  const loop = root.attributes.loop;

  const div = document.createElement("div");
  div.classList.add("audio-group");

  const btn = document.createElement("button");
  btn.innerHTML = root.innerHTML;
  root.innerHTML = "";

  const audio = DOMcreateAudio(src, type, loop);

  div.appendChild(btn);
  div.appendChild(audio);

  linkControls(root, btn, audio);
  if (resetting) {
    makeResetable(btn, audio);
  } else {
    makeStoppable(btn, audio);
  }

  root.appendChild(div);

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

function createAudioLoopNode(root) {
  createSoundEffectNode(root);
  let looping = true;
  let tO;
  const loopStart = root.attributes.loopStart.value;
  const loopEnd = root.attributes.loopEnd.value;

  const div = root.querySelector("div");
  const audio = root.querySelector("audio");

  const loopBtn = document.createElement("button");
  loopBtn.innerHTML = "ON"

  // Trigger Loop ON/OFF
  loopBtn.addEventListener("click", () => {
    // Activate Loop
    if (!looping) {
      looping = true;
      loopBtn.textContent = "ON";
      return;
    }
    // Exit Loop
    if (looping) {
      looping = false;
      loopBtn.textContent = "OFF";
      if (tO) {
        clearTimeout(tO);
        tO = undefined;
      }
      return;
    }
  });

  // Listen on timeupdate of audio to find looping timing.
  audio.addEventListener("timeupdate", () => {
    if (!looping || tO) {
      // Not looping, or timeout is already set
      return;
    }
    const loopEndsIn = loopEnd - audio.currentTime * 1000;
    if (loopEndsIn > 1000 || loopEndsIn < 0) {
      // Too soon to add trigger OR loopEnd has already passed.
      return;
    }
    tO = setTimeout(() => {
      audio.currentTime = loopStart / 1000;
      clearTimeout(tO);
      tO = undefined;
    }, loopEndsIn);
  });

  div.insertBefore(loopBtn, div.children[1])
  return root;
}

function DOMcreateAudio(src, type, loop) {
  const audio = document.createElement("audio");
  audio.src = src;
  audio.type = type;
  audio.preload = "auto";
  audio.controls = true;
  if (loop) audio.loop = true;
  return audio;
}

function DOMrenderCustomElements() {
  document.querySelectorAll("sound-effect")
  .forEach(createSoundEffectNode);
  document.querySelectorAll("audio-loop")
  .forEach(createAudioLoopNode);
}

document.addEventListener("DOMContentLoaded", () => {
  DOMrenderCustomElements();
});

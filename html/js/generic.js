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

function createAudioLoopNode(root) {
  createSoundEffectNode(root);
  let looping = true;
  let tO;
  const loopStart = root.attributes.loopStart.value;
  const loopEnd = root.attributes.loopEnd.value;

  const audio = root.querySelector("audio");

  const loopBtn = document.createElement("button");
  loopBtn.classList.add("audio-control");
  loopBtn.classList.add("loop");

  // Trigger Loop ON/OFF
  loopBtn.addEventListener("click", () => {
    if (!looping) {
      activateLoop();
    } else {
      exitLoop();
    }
  });

  function activateLoop() {
    looping = true;
    loopBtn.textContent = "ON";
    loopBtn.classList.add("looping");
  }

  function exitLoop() {
    looping = false;
    loopBtn.textContent = "OFF";
    loopBtn.classList.remove("looping");
    if (tO) {
      clearTimeout(tO);
      tO = undefined;
    }
  }

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

  activateLoop();
  root.insertBefore(loopBtn, root.children[1])
  return root;
}

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

function DOMrenderCustomElements() {
  document.querySelectorAll("sound-effect")
  .forEach(createSoundEffectNode);
  document.querySelectorAll("audio-loop")
  .forEach(createAudioLoopNode);
}

document.addEventListener("DOMContentLoaded", () => {
  DOMrenderCustomElements();
});

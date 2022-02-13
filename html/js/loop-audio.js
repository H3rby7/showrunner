function createAudioLoopNode(root) {
  createSoundEffectNode(root, true);
  let looping = true;
  let tO;
  const loopStart = root.attributes.loopStart.value;
  const loopEnd = root.attributes.loopEnd.value;

  const audio = root.querySelector("audio");
  const timeline = root.querySelector(".audio-timeline");

  const style = document.createElement("style");

  const loopBtn = document.createElement("button");
  loopBtn.classList.add("audio-control");
  loopBtn.classList.add("loop");

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
    paintLoop(true);
  }

  function exitLoop() {
    looping = false;
    loopBtn.textContent = "OFF";
    loopBtn.classList.remove("looping");
    paintLoop(false);
    if (tO) {
      clearTimeout(tO);
      tO = undefined;
    }
  }

  function paintLoop(active) {
    const bgProp = gradientForLoop(loopStart, loopEnd, audio.duration * 1000, active);
    style.innerHTML = `
      #${timeline.id}::-moz-range-track {
        background: ${bgProp};
      }
      #${timeline.id}::-webkit-slider-runnable-track {
        background: ${bgProp};
      }
    `
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

  audio.addEventListener("loadedmetadata", () => {
    activateLoop();
  }, {once: true});

  root.appendChild(style);
  root.insertBefore(loopBtn, root.children[1])
  return root;
}

function gradientForLoop(loopStart, loopEnd, duration, active) {
  const regularBackground = "var(--audio-timeline-bg-color)";
  const loopBackground = active ? "var(--audio-timeline-bg-loop-color)" : "var(--audio-timeline-bg-loop-inactive-color)";
  const start = calcPrioLower(loopStart);
  const end = calcPrioLower(loopEnd);
  return `linear-gradient(90deg, ${regularBackground} 0%, ${regularBackground} ${start}%, ${loopBackground} ${start}%, ${loopBackground} ${end}%, ${regularBackground} ${end}%, ${regularBackground} 100%)`;

  function calcPrioLower(timing) {
    const perc = timing * 100 /  duration;
    const percRounded = Math.round(perc);
    if (Math.abs(perc - percRounded) < 0.25) {
      return percRounded;
    }
    return perc > percRounded ? percRounded : perc;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("audio-loop")
    .forEach(createAudioLoopNode);
}, {once: true});

function createAudioLinkNode(root) {
  const forId = root.attributes.for.value;
  const action = root.attributes.action ? root.attributes.action.value : "start";
  const target = document.getElementById(forId);
  if (!target) {
    console.error(`Audio-Link: ID '${forId}' is not part of this page.`);
    return;
  }
  const targetAudio = target.querySelector(`#${forId} audio`);
  if (!targetAudio) {
    console.error(`Audio-Link: targetAudio '${forId}' is not part of this page.`);
    return;
  }
  let presetAudioLevel = targetAudio.volume;
  const label = target.attributes.label.value;
  const btn = document.createElement("button");
  btn.innerText = label;
  root.addEventListener("click", getHandler(action));
  root.appendChild(btn);

  function getHandler(actionString) {
    if (actionString === "start") {
      return start;
    }
    if (actionString === "stop") {
      return stop;
    }
    if (actionString === "fade-out-fast") {
      return () => {fadeOut(2000)};
    }
    if (actionString === "fade-out-medium") {
      return () => {fadeOut(5000)};
    }
    if (actionString === "fade-out-slow") {
      return () => {fadeOut(10000)};
    }
    if (actionString === "lower") {
      return lower;
    }
    if (actionString === "reset") {
      return reset;
    }
  }

  function start() {
    targetAudio.play();
  }

  function stop() {
    targetAudio.currentTime = 0;
    targetAudio.pause();
  }

  function lower() {
    presetAudioLevel = targetAudio.volume;
    volumeTransition(1000, targetAudio.volume / 5);
  }

  function reset() {
    volumeTransition(1000, presetAudioLevel);
  }

  function fadeOut(ms) {
    volumeTransition(ms, 0, () => {
      stop();
      targetAudio.volume = audioLevel;
    });
  }

  function volumeTransition(duration, desiredVolume, finishHandler) {
    const steps = 20;
    const intervalInMs = duration / steps;
    const audioLevel = targetAudio.volume;
    const audioChange = (audioLevel - desiredVolume) / steps;
    const loop = setInterval(() => {
      const nextVol = targetAudio.volume - audioChange;
      if (nextVol < 0.01) {
        nextVol = 0.01;
      } else if (nextVol > 1) {
        nextVol = 1;
      }
      targetAudio.volume = nextVol;
    }, intervalInMs);
    const timeout = setTimeout(() => {
      clearInterval(loop);
      clearTimeout(timeout);
      if (finishHandler) {
        finishHandler();
      }
    }, duration + intervalInMs)
  }
}

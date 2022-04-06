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
  }

  function start() {
    targetAudio.play();
  }

  function stop() {
    targetAudio.currentTime = 0;
    targetAudio.pause();
  }

  function fadeOut(ms) {
    const steps = 20;
    const intervalInMs = ms / steps;
    const audioLevel = targetAudio.volume;
    const audioDecrease = audioLevel / steps;
    const loop = setInterval(() => {
      const nextVol = targetAudio.volume - audioDecrease;
      targetAudio.volume = nextVol > 0.05 ? nextVol : 0.05;
    }, intervalInMs);
    const timeout = setTimeout(() => {
      clearInterval(loop);
      clearTimeout(timeout);
      stop();
      targetAudio.volume = audioLevel;
    }, ms + intervalInMs)
  }

}

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
  const presetAudioLevel = targetAudio.volume;
  const label = target.attributes.label.value.replace("<br>", "");
  const btn = document.createElement("button");
  btn.innerText = label;
  btn.addEventListener("click", getHandler(action));
  if (root.hasChildNodes()) {
    const firstBorn = root.removeChild(root.childNodes[0]);
    root.appendChild(btn);
    root.appendChild(firstBorn);
  } else {
    root.appendChild(btn);
  }

  function getHandler(actionString) {
    if (actionString === "start") {
      return start;
    }
    if (actionString === "play-from-start") {
      return playFromStart;
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
    if (actionString === "start-low") {
      return ()=> {
        targetAudio.volume = targetAudio.volume / 3;
        start();
      }
    }
    if (actionString === "fade-in-medium") {
      return ()=> {
        targetAudio.volume = targetAudio.volume / 5;
        start();
        reset();
      }
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

  function playFromStart() {
    targetAudio.currentTime = 0;
    start();
  }

  function stop() {
    targetAudio.currentTime = 0;
    targetAudio.pause();
  }

  function lower() {
    volumeTransition(1000, targetAudio.volume / 5);
  }

  function reset() {
    volumeTransition(2500, presetAudioLevel);
  }

  function fadeOut(ms) {
    const audioLevel = targetAudio.volume;
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
      let nextVol = targetAudio.volume - audioChange;
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

function createLightNode(root) {
  const forScene = root.attributes.scene.value;
  const fadeTime = root.attributes.fade ? root.attributes.fade.value : 1;
  const btn = document.createElement("button");
  btn.innerText = root.innerText;
  root.innerText = "";
  if (lights) {
    const targetScene = scenes[forScene];
    if (!targetScene) {
      console.error(`Light: Scene with name '${forScene}' is not defined.`);
      return;
    }
    btn.addEventListener("click", getHandler(targetScene, fadeTime));
  } else {
    btn.tabIndex = -1;
  }
  if (root.hasChildNodes()) {
    const firstBorn = root.removeChild(root.childNodes[0]);
    root.appendChild(btn);
    root.appendChild(firstBorn);
  } else {
    root.appendChild(btn);
  }

  function getHandler(targetScene, fadeTime) {
    return () => {
      console.log(`Light: Fading to ${forScene} over ${fadeTime} millis.`);
      switchToScene(targetScene, fadeTime);
    };
  }

}


function createMicNode(root) {
  const div = document.createElement("div");
  div.innerText = root.innerText;
  root.innerText = "";
  if (!muting) {
    div.style = "display: none;";
  }
  if (root.hasChildNodes()) {
    const firstBorn = root.removeChild(root.childNodes[0]);
    root.appendChild(div);
    root.appendChild(firstBorn);
  } else {
    root.appendChild(div);
  }
}

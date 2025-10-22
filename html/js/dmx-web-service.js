const server = "localhost:8080"
const backendBaseUrl = `http://${server}/api/v1`

let dimmerChannels = [];
function findDimmers() {
  if (!lights) {
    console.warn(`Lightcontrol via HTML is disabled.`);
    document.getElementById('the-play').classList.add('no-light-control');
    return;
  }
  if (!scenes) {
    console.error(`DMX Service: The global variable 'scenes' is not defined.`);
    return;
  }
  dimmerChannels = Object.keys(scenes).flatMap((k) => {
    if (!scenes[k] || !scenes[k].faded || !scenes[k].faded.length) {
      return [];
    }
    return scenes[k].faded;
  })
    .map(channelAndValue => channelAndValue.channel)
    .filter((value, index, array) => {
      return array.indexOf(value) === index;
    });
  console.log(`DMX Service: Dimmer channels are: ${dimmerChannels}`);
}

function fadeMultipleDMX(dmxList, fadeTimeMillis = 1) {
  if (typeof fadeTimeMillis == "string") {
    fadeTimeMillis = parseInt(fadeTimeMillis);
  }
  const url = `${backendBaseUrl}/dmx/fade`;
  const body = JSON.stringify({ fadeTimeMillis: fadeTimeMillis, scene: { list: dmxList } }, ' ', 2);
  console.log(body);
  fetch(url, {
    headers: {
      "content-type": "application/json"
    },
    body: body,
    method: "PATCH"
  })
    .then(() => console.log("SUCCESS!"))
    .catch(() => console.error("ERROR!"));
}

function switchToScene(scene, fadeTime) {
  if (scene.instant && scene.instant.length) {
    // Send any DMX values that we do not want to fade-in as first request
    fadeMultipleDMX(scene.instant);
  }
  if (scene.faded) {
    const chMap = new Map();
    for (let i = 0; i < dimmerChannels.length; i++) {
      chMap.set(dimmerChannels[i], 0);
    }
    for (let i = 0; i < scene.faded.length; i++) {
      const e = scene.faded[i];
      chMap.set(e.channel, e.value);
    }
    const dimmerValues = Array.from(chMap, ([channel, value]) => ({ channel, value }));
    fadeMultipleDMX(dimmerValues, fadeTime);
  }
}

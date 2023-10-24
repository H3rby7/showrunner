// Copy utility function. Can copy anything that is JSON-parseable
function cp(orig) {
  return JSON.parse(JSON.stringify(orig));
}

/**
 * Scales the faded values of a scene. Can be used to dim or light it up.
 * 
 * @param {scene} input Object with keys 'faded' and 'instant' both being DMX tuple arrays
 * @param {number} factor scaling factor for all faded DMX tuples
 * @returns the dimmed (or lit up) scene
 */
function dimScene(input, factor = 1) {
  const next = cp(input);
  next.faded = next.faded.map(cv => {
    let nextVal =  Math.round(cv.value * factor);
    if (nextVal < 0) {
      nextVal = 0;
    }
    if (nextVal > 255) {
      nextVal = 255;
    }
    return {
      channel: cv.channel, 
      value: cv.value * factor,
    };
  });
  return next;
}

/**
 * Merge scenes. For all conflicting channel values the higher one is taken.
 * 
 * @param {scene} a 
 * @param {scene} b 
 * @returns the merged scene
 */
function mergeScenes(a, b) {
  return {
    faded: mergeDMXLists(a.faded, b.faded),
    instant: mergeDMXLists(a.instant, b.instant),
  }
}

/**
 * Merge two DMX tuple arrays together
 * 
 * A DMX tuple is {channel: X, value: Y}.
 * 
 * For all conflicting channel values the higher one is taken.
 * 
 */
function mergeDMXLists(a, b) {
  const m = new Map();
  if (!a) {
    return b ? b : [];
  }
  if (!b) {
    return a ? a : [];
  }
  for (let i = 0; i < a.length; i++) {
    const el = a[i];
    m.set(el.channel, el.value);
  }
  for (let i = 0; i < b.length; i++) {
    const el = b[i];
    const existing = m.get(el.channel);
    if (!existing || (existing && existing < el.value)) {
      m.set(el.channel, el.value);
    }
  }
  return Array.from(m, ([channel, value]) => ({ channel, value }));
}

/**
 * **************************************************************************************
 * Example Data for fast testing
 * **************************************************************************************
 */
const exampleSceneA = {
  faded: [
    {channel: 4, value: 150},
  ],
  instant: [
    {channel: 1, value: 250},
    {channel: 2, value: 150},
    {channel: 3, value: 50},
  ]
}

// Example Data for fast testing
const exampleSceneB = {
  faded: [
    {channel: 5, value: 250},
  ]
}
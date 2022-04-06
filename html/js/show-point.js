function createAudioLinkNode(root) {
  const forId = root.attributes.for.value;
  const target = document.getElementById(forId);
  if (!target) {
    console.error(`Audio-Link: ID '${forId}' is not part of this page.`);
    return;
  }
  const targetBtn = target.querySelector(`#${forId}-btn-play`);
  if (!targetBtn) {
    console.error(`Audio-Link: 'Play' Button with ID '${forId}' is not part of this page.`);
    return;
  }
  const label = target.attributes.label.value;
  const btn = document.createElement("button");
  btn.innerText = label;
  root.addEventListener("click", () => {
    targetBtn.click();
  });
  root.appendChild(btn);
}

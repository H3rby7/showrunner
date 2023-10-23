let _usedIDs = [];

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   if (_usedIDs.indexOf(result) > -1) {
       return makeid(length);
   }
   _usedIDs.push(result);
   return result;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("sound-effect")
    .forEach((el) => createSoundEffectNode(el, false));
  document.querySelectorAll("audio-loop")
    .forEach(createAudioLoopNode);
  // AFTER audios have been created...
  document.querySelectorAll("audio-link")
    .forEach(createAudioLinkNode);
  document.querySelectorAll("light")
    .forEach(createLightNode);
  findDimmers();
}, {once: true});
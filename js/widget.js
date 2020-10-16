let callbackTriggers = -1;
function newAlert(txt){
  /*
  заменено генератором на сервере
  let synth = new SpeechSynthesisUtterance();
  synth.voice = voices[voiceIndex];
  synth.text  = txt;
  window.speechSynthesis.speak(synth);
  synth.onend = function () {
    alertEnded();
  }*/
  let voiceover = fetch("/generator/create.php?key="+ps.get("key")+"&text="+Base64.encode(txt))
  .then(r => r.text()).then(t => {
    setTimeout(function(){
      let player = document.getElementById("audioPlayer");
      player.src = "/generator/"+t;
      player.load();
      callbackTriggers = 0;
      player.onended = function() {
        callbackTriggers += 1;
      }
      player.oncanplay = function () {
        player.play();
        document.getElementById("alert").style.opacity = "1";
        document.getElementById("txt").innerText = txt;
        setTimeout(function () {
          callbackTriggers += 1;
          document.getElementById("alert").style.opacity = "0";
          setTimeout(alertEnded,500);
        },10000);
      }
    },500);
  });
}

window.onload = function(){
    document.getElementById("btn").style.display = "none";
    setInterval(checkForNew,10000); // можно поменять на любой
}

function alertEnded() {
  if(callbackTriggers == 2){
    checkForNew();
  }
}

const parsedUrl = new URL(window.location.href);
let ps = parsedUrl.searchParams;

function checkForNew(resp = ""){
  const response = fetch("/widgetupdate.php?key="+ps.get("key"), {
    method: 'GET',
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  }).then(response => response.json()).then(data => {
    if(data.response == "incorrect" || data.response == "fail"){ return; }
    newAlert(data.text);
  });
}

function getVoiceIndex(v) {
  // скорее всего, не используется (см. 1 комментарий в этом файле)
  let possibleVoices = ["Maxim", "Google русский", "Irina"];
  let selectedIndex = -1;
  for(let i = 0; i < possibleVoices.length; i++){
    selectedIndex = v.findStr(possibleVoices[i]);
    if(selectedIndex != -1){ break; }
  }
  if(selectedIndex == -1){
    selectedIndex = v.findLocal();
  }
  return selectedIndex;
}


/* Тесты: checkForNew('{"newEls":["привет валера"]}'); */

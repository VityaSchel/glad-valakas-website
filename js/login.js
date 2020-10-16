let password = document.getElementById("password");
let mainPage = document.getElementById("main-page");
let loginPage = document.getElementById("login-page");
let listPage = document.getElementById("list-page");
let orderSwitch = document.getElementById("order-switch");
let orderSwitchOff = document.getElementById("order-switch-off");

let allOrders = [];

orderSwitch.addEventListener("change", function () {
  setTimeout(changed, 500);
});

window.addEventListener("load", function () {
  if(orderSwitch.checked){
    orderSwitch.removeAttribute("checked");
    orderSwitch.checked = false;
  }
  if(!orderSwitchOff.checked){
    orderSwitchOff.setAttribute("checked","checked");
    orderSwitchOff.checked = true;
  }
});

function changed() {
  mainPage.style.display = "none";
  if(cookie.get('credentials')){
    key = cookie.get('credentials');
    loadList();
  } else {
    requestLogin();
  }
}

function requestLogin() {
  loginPage.style.display = "";
}

function log() {
  key = password.value;
  cookie.set("credentials", key, {
   expires: 999999,
});
  loadList();
}

let key = "";

document.getElementsByClassName("moreButton")[0].addEventListener("click", function () {
  more();
  return false;
});

document.getElementsByClassName("continue")[0].addEventListener("click", function () {
  log();
  return false;
});

orderSwitchOff.addEventListener("change", function (){
  fetch("/shutoff.php?key="+key, {
    method: 'GET',
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });
  if(orderSwitch.checked){
    orderSwitch.removeAttribute("checked");
    orderSwitch.checked = false;
  }
  if(!orderSwitchOff.checked){
    orderSwitchOff.setAttribute("checked","checked");
    orderSwitchOff.checked = true;
  }
  listPage.style.display = "none";
  mainPage.style.display = "";
  clearTimeout(renewListTimeout);
  timeoutSet = false;
});

let renewListTimeout;
let timeoutSet = false;
function loadList(){
  const response = fetch("/update.php?key="+key+bQueuedOnly, {
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
    let respCode = data.response;
    switch(respCode){
      case "incorrect":
        alert("Неправильный пароль");
        listPage.style.display = "none";
        loginPage.style.display = "";
        clearTimeout(renewListTimeout);
        break;

      case "success":
        listPage.style.display = "";
        loginPage.style.display = "none";
        if(!timeoutSet){
          fetch("/activateon.php?key="+key, {
            method: 'GET',
            mode: 'no-cors',
            cache: 'no-cache',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
          });
          renewListTimeout = setInterval(loadList, 10000);
          timeoutSet = true;
        }
        renewData(data,document.getElementById("moreButton"));
        break;

      default:
        alert("Ошибка на сервере. Возможно, перегружен");
        listPage.style.display = "none";
        loginPage.style.display = "";
        clearTimeout(renewListTimeout);
        break;
    }
  });
}

function more(){
  const respons = fetch("/update.php?key="+key, {
    method: 'GET',
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  }).then(resp => respons.json())
  .then(res => {
    renewData(res, document.getElementById("moreButton"));
  });
}

let showedNotifications = [];
let lastNotification = 0;
let page = 1;
function renewData(resp, beforeEl) {
  let response = resp.els.reverse();
  let queued = resp.new;

  let more = resp.more;
  let btnShowMore = document.getElementById("moreButton");
  if(more == 1){
    btnShowMore.style.display = "block";
  } else {
    btnShowMore.style.display = "none";
  }
  document.getElementById("qdFilterTextCounter").innerText = queued;
  for(let i = 0; i < response.length; i++){
    if(allOrders.indexOf(response[i].id) > -1){ return; }
    allOrders.push(response[i].id);
    showedNotifications.unshift(response[i].id); //?? что это
    lastNotification = response[i].id;
    let notificationBlock = document.createElement("div");
    notificationBlock.className = "notification-block";

    let timeStamp = document.createElement("div");
    timeStamp.className = "time-stamp";
    timeStamp.innerText = getTime(response[i].timestamp);
    notificationBlock.appendChild(timeStamp);

    let block1 = document.createElement("block1");
    block1.className = "block1";

    let numberInput = document.createElement("input");
    numberInput.className = "number";
    numberInput.setAttribute("readonly", "true");
    numberInput.value = response[i].number;
    numberInput.setAttribute("onclick", "openskype('skype://"+getNumber(response[i].number)+"?call')");
    block1.appendChild(numberInput);

    let div1 = document.createElement("div");

    let img1 = document.createElement("img");
    img1.src = "/img/clock-icon.png";
    img1.height = "20";
    img1.setAttribute("title", "История звонков");
    img1.addEventListener("click", function(){history(this);});
    div1.appendChild(img1);
    block1.appendChild(div1);

    let div2 = document.createElement("div");

    let img2 = document.createElement("img");
    img2.src = "/img/block-icon.png";
    img2.height = "20";
    img2.setAttribute("title", "Бан");
    img2.addEventListener("click", function(){block(this);});
    img2.style.display = response[i].banned == "1" ? "none" : "";
    div2.appendChild(img2);
    block1.appendChild(div2);

    let div3 = document.createElement("div");
    div3.className = "typeOuter";

    let label = document.createElement("label");
    label.className = "type";
    let type = "";
    switch(response[i].type){
      case 1:
        type = "Рофл-звонок";
        break;

      case 2:
        type = "Звонок уткарю";
        break;

      case 3:
        type = "Реп трек";
        break;
    }
    label.innerText = type;
    div3.appendChild(label);
    block1.appendChild(div3);
    notificationBlock.appendChild(block1);

    let block2 = document.createElement("div");
    block2.className = "block2";
    block2.innerText = response[i].description;
    if(response[i].description == ""){
      block2.innerHTML = "<i>Нет информации</i>";
      block2.className = "block2 noAdditionalInfo";
      block2.style.color = "#444444";
    }
    notificationBlock.appendChild(block2);

    let div4 = document.createElement("div");
    div4.className = "buttons-links";

    let stateHref = document.createElement("a");
    stateHref.href = "#";
    stateHref.addEventListener("click", function(){changeState(this); return false;});
    stateHref.className = "state notReady";
    if(response[i].status == "done"){
      setTimeout(function(){
        changeState(stateHref,true);
      },500);
    }
    stateHref.innerText = "Отметить как готовое";
    div4.appendChild(stateHref);

    let unbanHref = document.createElement("a");
    unbanHref.href = "#";
    unbanHref.addEventListener("click", function(){unban(this); return false;});
    unbanHref.className = "unban";
    unbanHref.style.display = response[i].banned == "1" ? "" : "none";
    unbanHref.innerText = "Разбанить номер";
    div4.appendChild(unbanHref);

    notificationBlock.setAttribute("invoiceid", response[i].id);
    notificationBlock.appendChild(div4);
    document.getElementById("notif-blocks").insertBefore(notificationBlock,document.getElementById("moreButton"));
  }
}

function openskype(s) {
  window.location.href = s;
}

let bQueuedOnly = "";
let queuedFilter = document.getElementById("queuedFilter");
queuedFilter.addEventListener("changed", function(){
  if(queuedFilter.checked){
    bQueuedOnly = "&onlyQueued=1";
  } else {
    bQueuedOnly = "";
  }
  let ns = document.getElementById("notification-container");
  ns.outerHTML = "";
  loadList();
});

let numberField = document.getElementById("numberFilter");
let j_;
numberField.addEventListener("input", function(){
  j_ += 1;
  let k__ = j_;
  setTimeout(function () {
    if(k__ != j_) { return; }
    let search = numberField.value;
    if(search == ""){
      loadList();
      return;
    }
    let ns = document.getElementById("notification-container");
    ns.outerHTML = "";
    const respons = fetch("/update.php?key="+key+"&term="+encodeURI(search), {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    }).then(resp => respons.json())
    .then(res => {
      renewData(res, document.getElementById("moreButton"));
    });
  });
});

let blockTemp;
function block(o){
  blockTemp = o;
  document.getElementById("ban-options").style.display = "block";
}

function banUser() {
  document.getElementById("ban-options").style.display = "none";
  let invid = blockTemp.parentNode.parentNode.parentNode.getAttribute("invoiceid");
  fetch("/banUser.php?key="+key+"&invoiceid="+invid, {
    method: 'GET',
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });
  blockTemp.parentNode.parentNode.parentNode.outerHTML = "";
}

function banNumber() {
  document.getElementById("ban-options").style.display = "none";
  let number = blockTemp.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].value;
  fetch("/banNumber.php?key="+key+"&number="+Base64.encode(number), {
    method: 'GET',
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });
  ban(blockTemp);
}

function banCancel() {
  document.getElementById("ban-options").style.display = "none";
}

function ban(o) {
  o.parentNode.parentNode.parentNode.childNodes[3].childNodes[1].style.display = "";
  o.style.display = "none";
  changeState(o.parentNode.parentNode.parentNode.childNodes[3].childNodes[0],true);
  // TODO: сделать по-человечески
}

function unban(o) {
  o.style.display = "none";
  o.parentNode.parentNode.childNodes[1].childNodes[2].childNodes[0].style.display = "";
  let number = o.parentNode.parentNode.childNodes[1].childNodes[0].value;
  fetch("/unbanNumber.php?key="+key+"&number="+Base64.encode(number));
}

function history(o) {
  let _window = window.open("/history.php?number="+Base64.encode(o.parentNode.parentNode.childNodes[0].value), "История", "width=800,height=400");
}

function changeState(o,setToNotReady = false,auto = false) {
  let currentState;
  if(o.className == "state notReady"){
    currentState = "ready";
    if(!auto){
      fetch("/orderDone.php?key="+key+"&state="+currentState+"&invid="+o.parentNode.parentNode.getAttribute("invoiceid"));
    }
  } else {
    currentState = "notReady";
    if(!auto){
      fetch("/orderDone.php?key="+key+"&state="+currentState+"&invid="+o.parentNode.parentNode.getAttribute("invoiceid"));
    }
  }
  if(setToNotReady == true || currentState == "ready"){
    o.innerText = "Отметить как неготовое";
    o.className = "state ready";
    o.parentNode.parentNode.style.opacity = "0.25";
  } else {
    o.innerText = "Отметить как готовое";
    o.className = "state notReady";
    o.parentNode.parentNode.style.opacity = "1";
  }
}

function getTime(unixTimestamp) {
  let date = new Date(unixTimestamp * 1000);
  let year = date.getFullYear();
  let day = date.getDate();
  let month = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","ноября","декабря"][date.getMonth()];
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let formattedTime = day + ' ' + month + ' ' + year + ' ' + hours + ':' + minutes.substr(-2);
  return formattedTime;
}

function getNumber(n) {
  n = n.replace(" ",'');
  n = n.replace("-",'');
  n = n.replace("(",'');
  n = n.replace(")",'');
  if(n.indexOf("+") != 0){
    n = "+"+n;
  }
  return n;
}

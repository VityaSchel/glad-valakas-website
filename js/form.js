let formOrder = document.forms["order"];
let phoneField = formOrder.elements["phone"];
let im = new Inputmask({"mask": "+9{1,3} (999) 999-99-99"});
im.mask(phoneField);
let errorwarning = document.getElementById("error-warning");
let availableCalls;
let blockPayment = document.getElementById("block-payment");
let blockFailure = document.getElementById("block-failure");
let blockNoCalls = document.getElementById("block-not-available");
let blockSuccess = document.getElementById("block-success");
const parsedUrl = new URL(window.location.href);
let ps = parsedUrl.searchParams;
if(ps.has("success")){
  switchBlocks(4);
} else {
  if(ps.has("fail")){
    switchBlocks(2);
  } else {
    let resp = fetch("/active").then(resp => resp.text()).then(t => {
      availableCalls = Boolean(Number(t));
      if(!availableCalls){
        switchBlocks(3);
      } else {
        switchBlocks(1);
      }
    });
  }
}

function switchBlocks(i) {
  blockPayment.style.display = i==1?"":"none";
  blockFailure.style.display = i==2?"":"none";
  blockNoCalls.style.display = i==3?"":"none";
  blockSuccess.style.display = i==4?"":"none";
}

let skipNoInfoWarning = false;
function procceedToPay() {
  errorwarning.innerText = "";
  let phoneFieldRegex = /^(\+*\d{1,3})((\(\d{3}\))|( \(\d{3}\) )|\d{3}| \d{3})( {0,1}|-)(\d{3}-\d{2}-\d{2}|\d{3} \d{2} \d{2}|\d{3}\d{2}\d{2})$/ig;
  // вторая проверка из трех
  if(phoneFieldRegex.exec(phoneField.value) == null){
    errorwarning.innerText = "Введите номер в правильном формате";
    return false;
  }

  let typeButtons = document.getElementsByName("phoneGroup");
  if(!typeButtons[0].checked && !typeButtons[1].checked && !typeButtons[2].checked){
    errorwarning.innerText = "Пожалуйста, укажите тип звонка";
    return false;
  }

  if(additionalInfo.value == ""){
    if(skipNoInfoWarning){
      sendToPayment();
    } else {
      errorwarning.innerText = "Чтобы продолжить без доп. информаци, нажмите повторно";
      skipNoInfoWarning = true;
      return false;
    }
  } else {
    sendToPayment();
  }
}

function type(){
  if(document.getElementById("rofl-check").checked){ return 1; }
  else if(document.getElementById("utka-check").checked){ return 2; }
  else if(document.getElementById("rap-check").checked){ return 3; }
  else { alert("Ты дурак что-ли?"); }
}

function d(n,s) {
  n.value.replace(/[^0-9]/gi, "");
  return `Заказ Рофл-звоночка от В. А. Жмышенко на номер ${n} на сумму ${s}`;
}

let n = document.getElementById("number");
n.addEventListener("input", function(){
  ignoreDuplicates = false;
});

let sent = false;
let ignoreDuplicates = false;
function sendToPayment() {
  if(sent){return false;}
  let t = type();
  let i = document.getElementById("additionalInfo").value;
  let data = {
    number: n.value,
    type: t,
    info: i
  }
  sent = true;
  let ignoreOld = Number(ignoreDuplicates);
  let url = `/procceedToPay.php?ignoreOld=${ignoreOld}`;
  let response_ = fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  }).then(response_ => response_.json()).then(data => {
      switch(data.response){
        case "":
          alert("Не отвечает");
          break;

        case "500":
          alert("Ошибка 500");
          break;

        case "ban":
          alert("тебе выдан бан другалек");
          break;

        case "duplicate":
          let number = n.value;
          errorwarning.innerHTML = "На этот номер уже был <a href='/history.php?number="+Base64.encode(number)+"'>заказ</a>, нажмите повторно чтобы сделать еще один";
          ignoreDuplicates = true;
          sent = false;
          break;

        case "success":
          i = data.invoiceID;
          let h = data.hash;
          //никому не говори
          let form = document.getElementById("robokassa");
          let s = t===1?350:t===2?1000:1500;
          //не изменяй сумму

          let _f = form.elements;
          _f[0].value = '{id магазина робокассы}';
          _f[1].value = s;
          _f[2].value = i;
          _f[3].value = d(n,s);
          _f[4].value = h;
          form.submit();
          break;
      }
    });
}

let currentVersion = "standalone";
setInterval(function(){
  if(window.innerWidth < window.innerHeight){
    if(currentVersion == "standalone"){
      let mobileStyle = document.createElement("link");
      mobileStyle.setAttribute("rel", "stylesheet");
      mobileStyle.setAttribute("href", "/stylesheets/mobile.css?v=1.1");
      mobileStyle.setAttribute("id", "mobileStylesheet");
      document.getElementsByTagName("head")[0].appendChild(mobileStyle);
    }
    currentVersion = "mobile";
  } else {
    if(currentVersion == "mobile"){
      document.getElementById("mobileStylesheet").outerHTML = "";
    }
    currentVersion = "standalone";
  }
}, 10);

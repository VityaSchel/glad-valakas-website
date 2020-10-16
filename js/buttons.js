let btns = document.querySelectorAll(".user-button");
for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener("mousedown",function () {
    this.classList.add("user-button-active");
  });
  btns[i].addEventListener("mouseup",function () {
    this.classList.remove("user-button-active");
  });
  btns[i].addEventListener("mouseout",function () {
    this.classList.remove("user-button-active");
  });
}

let menu;
let toggler;
let buttons;

const state = {
  isDisplayed: false
};

function show() {
  buttons.style.display = "block";
  state.isDisplayed = true;
}

function hide() {
  buttons.style.display = "none";
  state.isDisplayed = false;
}

function onClickToggler() {
  if (state.isDisplayed) hide();
  else show();
}

function onDomContentLoaded() {
  menu = document.querySelector(".nav-menu");
  toggler = menu.querySelector(".nav-menu__toggler");
  buttons = menu.querySelector(".nav-menu__buttons");

  if (buttons) state.isDisplayed = getComputedStyle(buttons).display !== "none";
  if (toggler) toggler.addEventListener("click", onClickToggler);
}

document.addEventListener("DOMContentLoaded", onDomContentLoaded);

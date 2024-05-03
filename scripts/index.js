import { cameraInit } from "./views/cameraViews.js";
import { ageCalInit } from "./views/ageCalViews.js";
import { gallery, galleryInit } from "./views/galleryViews.js";
const toggleBtnOneOff = document.querySelector(".toggleBtn-oneOff");
export const mobileBox = document.querySelector(".mobile");
const clockTime = document.querySelector(".clock-time");
const clockDay = document.querySelector(".clock-day");
const topNotchTime = document.querySelector(".topNotch-time");
const mobileComp = document.querySelectorAll(".mobileComp");
const isOff = document.querySelectorAll(".isOff");
export const OtherAppsBtn = document.querySelector(".OtherAppsBtn");
export const homeScreen = document.querySelector(".homeScreen");
export const gotoHomeBtn = document.querySelector(".gotoHomeBtn");
export const allAppScreen = document.querySelector(".allAppScreen");
export const allApps = document.querySelector(".allApps");
// export const galleryBtn = document.querySelector(".galleryBtn");
// export const gallery = document.querySelector(".gallery");
// export const galleryView = document.querySelector(".gallery-view");

// localStorage.clear()
let isOn = localStorage.getItem("isOn")
  ? JSON.parse(localStorage.getItem("isOn"))
  : false;

let wallpaperImg = localStorage.getItem("wallpaperImg")
  ? JSON.parse(localStorage.getItem("wallpaperImg"))
  : "img/defaulfwallpaper.jpeg";

toggleBtnOneOff.addEventListener("click", function (e) {
  if (isOn) {
    mobileComp.forEach((el) => {
      el.classList.add("isOff");
    });
    mobileBox.style.backgroundImage = `url(img/closed.avif)`;
    isOn = false;
    localStorage.setItem("isOn", JSON.stringify(isOn));
    console.log("off");
  } else {
    mobileComp.forEach((el) => {
      el.classList.remove("isOff");
    });
    mobileBox.style.backgroundImage = `url(${wallpaperImg})`;
    isOn = true;
    localStorage.setItem("isOn", JSON.stringify(isOn));
    console.log("on");
  }
});

if (isOn) {
  mobileComp.forEach((el) => {
    el.classList.remove("isOff");
  });
  mobileBox.style.backgroundImage = `url(${wallpaperImg})`;
} else {
  mobileComp.forEach((el) => {
    el.classList.add("isOff");
  });
  mobileBox.style.backgroundImage = `url(img/closed.avif)`;
}
const homescreenStyle = document.querySelector(".homescreen");
function getCurTime() {
  const now = new Date();
  const fullDate = String(now).split(" ");
  const [today, month, date] = fullDate;
  const hrs = String(now.getHours()).padStart(2, 0);
  const min = String(now.getMinutes()).padStart(2, 0);
  topNotchTime.innerHTML = `${hrs}:${min}`;
  clockTime.innerHTML = `${hrs} : ${min}`;
  clockDay.innerHTML = `${today}, ${String(date).padStart(2, 0)} ${month}`;
}

setInterval(getCurTime, 1000);
OtherAppsBtn.addEventListener("click", function () {
  homeScreen.classList.add("hidden");
  allAppScreen.classList.remove("hidden");
  console.log("kola");
});

gotoHomeBtn.addEventListener("click", function () {
  homeScreen.classList.remove("hidden");
  allAppScreen.classList.add("hidden");
  gallery.classList.add("hidden");
});

//Gallery App view
galleryInit();

//Camera App view
cameraInit();

//Age Calculator App view
ageCalInit();

import {
  homeScreen,
  OtherAppsBtn,
  gotoHomeBtn,
  allAppScreen,
  allApps,
} from "../index.js";
import { gallery, picArr, picData, galleryFunc } from "./galleryViews.js";
// ***** LOCAL VARIABLES FOR CAMERA APP *****
const camera = document.querySelector(".camera");
const cameraBtn = document.querySelectorAll(".cameraBtn");
const cameraBack = document.querySelector(".camera-back");
const video = document.getElementById("video2");
const canvas = document.getElementById("canvas2");
const captureBtn = document.getElementById("captureBtn2");
const flashOverlay = document.querySelector(".flash-overlay");
export const lastPic = document.querySelector(".lastPic");

let lastPicClicked = false;

export function galleryBackBtn() {
  //galleryBackBtn, if the user enter the gallery through the camera app then the galleryBackBtn take the user back to the app else the user goes back to All Apps page
  const galleryBackBtn = document.querySelector(".gallery-back");
  galleryBackBtn.addEventListener("click", function () {
    if (lastPicClicked) {
      camera.classList.remove("hidden");
      gallery.classList.add("hidden");
      allAppScreen.classList.add("hidden");
      lastPicClicked = false;
    } else {
      allApps.classList.remove("hidden");
      gallery.classList.add("hidden");
      allAppScreen.classList.remove("hidden");
      console.log("active", "galleryBackBtn");
    }
  });
}
galleryBackBtn();
// CAMERA APP
export function cameraInit() {
  //The camera App will run if the user click the camera btn from the home page
  function homeCamera() {
    cameraBtn[0].addEventListener("click", function () {
      homeScreen.classList.add("hidden");
      camera.classList.remove("hidden");
    });

    cameraBack.addEventListener("click", function () {
      homeScreen.classList.remove("hidden");
      camera.classList.add("hidden");
      allAppScreen.classList.add("hidden");
    });
  }
  homeCamera();

  //The camera App will run if the user click the camera btn from the All Apps page
  OtherAppsBtn.addEventListener("click", function () {
    cameraBtn[1].addEventListener("click", function () {
      allApps.classList.add("hidden");
      camera.classList.remove("hidden");
      allAppScreen.classList.add("hidden");
    });

    cameraBack.addEventListener("click", function () {
      allApps.classList.remove("hidden");
      camera.classList.add("hidden");
      homeScreen.classList.add("hidden");
      allAppScreen.classList.remove("hidden");
    });
  });

  gotoHomeBtn.addEventListener("click", function () {
    homeCamera();
  });

  // Access webcam
  async function initWebcam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  }

  // Capture image
  captureBtn.addEventListener("click", () => {
    // Flash effect
    flashOverlay.classList.add("flash");
    setTimeout(() => {
      flashOverlay.classList.remove("flash");
    }, 200);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const imgSrc = canvas.toDataURL("image/jpeg");
    picArr.push(imgSrc);
    lastPic.innerHTML = `<img src=${picArr.at(-1)} alt="">`;
    localStorage.setItem("picData", JSON.stringify(picArr));
    galleryFunc();
    gallery.innerHTML = `
        <div class="gallery-back">back</div>
        `;
    gallery.insertAdjacentHTML("afterbegin", picData);
    galleryBackBtn();
  });

  lastPic.innerHTML = `<img src=${picArr.at(-1)} alt="">`;

  lastPic.addEventListener("click", function () {
    camera.classList.add("hidden");
    gallery.classList.remove("hidden");
    lastPicClicked = true;
  });

  // Initialize webcam
  initWebcam();
}

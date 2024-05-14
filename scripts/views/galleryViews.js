/**
 * This code snippet exports several variables and functions related to a gallery feature.
 * It includes functions for initializing the gallery, getting image type and size, rendering the gallery view page, and handling various event listeners.
 * The code also includes an array for storing image data and a function for generating the HTML markup for the gallery.
 * The gallery functionality allows users to view and interact with images, set images as wallpaper, delete images, and navigate between different views.
 */
import { allApps, allAppScreen, mobileBox } from "../index.js";
import { galleryBackBtn, lastPic } from "./cameraViews.js";

export const galleryBtn = document.querySelector(".galleryBtn");
export const gallery = document.querySelector(".gallery");
export const galleryView = document.querySelector(".gallery-view");

export let picArr = JSON.parse(localStorage.getItem("picData")) || [
  "img/pic-1.jpg",
  "img/pic-2.jpg",
  "img/pic-3.jpg",
  "img/pic-4.jpg",
  "img/pic-5.jpg",
  "img/pic-6.jpg",
  "img/pic-7.jpg",
  "img/pic-8.jpg",
  "img/pic-9.jpg",
  "img/pic-10.jpg",
  "img/pic-11.jpg",
  "img/pic-12.jpg",
  "img/pic-13.jpg",
  "img/pic-14.jpg",
  "img/pic-15.jpg",
  "img/pic-16.jpg",
  "img/pic-17.jpg",
  "img/pic-18.jpg",
  "img/pic-19.jpg",
  "img/pic-20.jpg",
  "img/pic-21.jpg",
  "img/pic-22.jpg",
  "img/pic-23.jpg",
  "img/pic-24.jpg",
];

export let picData;

export function galleryFunc() {
  picData = "";
  picArr.forEach((el, i) => {
    picData += `<img src=${el} alt='' class='pic' data-index='${i}'>`;
  });
}

export const getImgTypeAndSize = async function (img) {
  /**
   * This code exports several variables and functions related to a gallery feature.
   * It includes functions for initializing the gallery, getting image type and size, rendering the gallery view page, and handling various event listeners.
   * The code also includes an array for storing image data and a function for generating the HTML markup for the gallery.
   * The gallery functionality allows users to view and interact with images, set images as wallpaper, delete images, and navigate between different views.
   */
  const res = await fetch(img.src);
  const blob = await res.blob();
  const width = img.width;
  const height = img.height;
  const index = img.dataset.index;
  const sizeInBytes = blob.size;
  const formattedSizeInBytes = sizeInBytes.toLocaleString();
  const imgType = blob.type;
  renderPage(img.src, formattedSizeInBytes, imgType, width, height, index);
};

function renderPage(src, size, type, width, height, index) {
  /**
   * Renders the gallery view page with the provided image data.
   *
   * @param {string} src - The source of the image.
   * @param {string} size - The size of the image in bytes.
   * @param {string} type - The type of the image.
   * @param {number} width - The width of the image.
   * @param {number} height - The height of the image.
   * @param {number} index - The index of the image in the gallery.
   * @returns {void}
   */

  let settingClicked = false;
  const data = `
        <div class="gallery-view-back">
        back
       </div>
        <img src=${src} alt='' class='pic'>
        <div class="gallery-view-setting">
        <img src="img/gear-fill.svg" alt="">
        </div>
      
        <div class="gallery-view-setting-opts">
        <li class="gallery-view-setting-opt SAW" data-src='${src}'>Set as wallpaper</li>
        <li class="gallery-view-setting-opt">Size: ${size} bytes</li>
        <li class="gallery-view-setting-opt">Item type: ${type} bytes</li>
        <li class="gallery-view-setting-opt">Dimensions: ${width} x ${height}</li>
        <li class="gallery-view-setting-opt deletePic" data-indexref='${index}'>Delete item</li>
      </div>
        `;
  galleryView.innerHTML = data;

  //galleryView event listeners
  const galleryViewBack = document.querySelector(".gallery-view-back");
  const galleryViewSetting = document.querySelector(".gallery-view-setting");
  const SAWBtn = document.querySelector(".SAW");
  const deletePic = document.querySelector(".deletePic");

  galleryViewBack.addEventListener("click", function () {
    galleryView.classList.add("hidden");
    gallery.classList.remove("hidden");
  });

  galleryViewSetting.addEventListener("click", function () {
    const opts = document.querySelector(".gallery-view-setting-opts");
    if (settingClicked) {
      opts.classList.remove("gallery-view-setting-opts-show");
      settingClicked = false;
    } else {
      opts.classList.add("gallery-view-setting-opts-show");
      settingClicked = true;
    }
  });

  SAWBtn.addEventListener("click", function (e) {
    const Imagesrc = e.target.dataset.src;
    localStorage.setItem("wallpaperImg", JSON.stringify(Imagesrc));
    mobileBox.style.backgroundImage = `url(${Imagesrc})`;
  });

  //Deletes image item
  deletePic.addEventListener("click", function () {
    let i = deletePic.dataset.indexref;
    picArr.splice(i, 1);
    lastPic.innerHTML = `<img src=${picArr.at(-1)} alt="">`;
    galleryView.classList.add("hidden");
    gallery.classList.remove("hidden");
    localStorage.setItem("picData", JSON.stringify(picArr));
    galleryFunc();
    gallery.innerHTML = `
          <div class="gallery-back">back</div>
          `;
    gallery.insertAdjacentHTML("afterbegin", picData);
    galleryBackBtn();
  });
}

export function galleryInit() {
  galleryBtn.addEventListener("click", function () {
    allApps.classList.add("hidden");
    gallery.classList.remove("hidden");
    allAppScreen.classList.add("hidden");
  });

  galleryFunc();

  gallery.insertAdjacentHTML("afterbegin", picData);

  gallery.addEventListener("click", function (e) {
    if (e.target.classList.contains("pic")) {
      galleryView.classList.remove("hidden");
      gallery.classList.add("hidden");
      getImgTypeAndSize(e.target);
    }
  });
}

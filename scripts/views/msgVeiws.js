/**
 * This code snippet initializes and controls a messaging application.
 * It imports necessary modules and defines variables for various elements in the application.
 * It also includes functions for updating and displaying messages, sending SMS, selecting recipients, and handling user interactions.
 * The code snippet is part of a larger JavaScript project and is intended to be used in conjunction with other modules.
 */
import { contactLogsArr } from "./callViews.js";
import {
  homeScreen,
  OtherAppsBtn,
  gotoHomeBtn,
  allAppScreen,
  allApps,
} from "../index.js";
const msg = document.querySelector(".msg");
const msgBtn = document.querySelectorAll(".msgBtn");
const msgHome = document.querySelector(".msg-home");
const msgBack = document.querySelector(".msg-back");
const msgSentLists = document.querySelector(".msg-lists");
const msgNew = document.querySelector(".msg-new");
const msgNewBack = document.querySelector(".msg-new-back");
const msgOptsLists = document.querySelector(".msg-opts-lists");
const msgInputSearch = document.querySelector("#msgInputSearch");
const msgOptsInputSearch = document.querySelector("#msgOptsInputSearch");
const newMsgBtn = document.querySelector(".new-msg-btn");
const msgDm = document.querySelector(".msg-dm");
const msgAll = document.querySelector(".msg-all");
const msgAllContent = document.querySelector(".msg-all-content");
const msgDmSetting = document.querySelector(".msg-dm-setting");
const msgDmSettingContent = document.querySelector(".msg-dm-setting-cont");
const delAllDm = document.querySelector(".del-all-dm");
const rcvrPic = document.querySelector(".rcvr-pic");
const rcvrName = document.querySelector(".rcvr-name");
const msgDmBack = document.querySelector(".msg-dm-back");

let content = "";

let clickedDmSetting = false;
let textAdded = false;
let identifier;
let msgSentListsArr = JSON.parse(localStorage.getItem("msgSentListsArr")) || [];
updateSentMsgLists(msgSentListsArr);
function autoExpand(field) {
  // Reset field height
  field.style.height = "inherit";
  // Get the computed styles for the element
  var computed = window.getComputedStyle(field);

  // Calculate the height
  var height =
    parseInt(computed.getPropertyValue("border-top-width"), 10) +
    parseInt(computed.getPropertyValue("padding-top"), 10) +
    field.scrollHeight +
    parseInt(computed.getPropertyValue("padding-bottom"), 10) +
    parseInt(computed.getPropertyValue("border-bottom-width"), 10);

  field.style.height = height + "px";
}

function updateAllTexts(textsArr) {
  /**
   * Updates the display of all text messages in the message view.
   *
   * @param {Array} textsArr - An array of text messages to be displayed.
   * @returns {void}
   */

  content = "";
  if (!textsArr) {
    msgAllContent.innerHTML = content;
    return;
  }
  textsArr.forEach((el, i) => {
    content += `<div class="msg-dm-each" data-id='${i}'>
        <div class="msg-dm-each-text">${el.msgTextValue}</div>
        <div class="msg-dm-each-time">${el.time}</div>
        </div>`;
  });

  msgAllContent.innerHTML = content;

  document.querySelectorAll(".msg-dm-each").forEach((el) => {
    el.addEventListener("dblclick", function () {
      const i = Number(el.dataset.id);
      identifier.msgTexts.splice(i, 1);
      localStorage.setItem("contactLogsArr", JSON.stringify(contactLogsArr));
      updateAllTexts(identifier.msgTexts);
      // console.log(identifier.msgTexts)
      // console.log('action3');
    });
  });

  msgAllContent.addEventListener("click", function (e) {
    if (e.target.classList.contains("msg-dm-each")) {
      const i = Number(e.target.dataset.id);
      identifier.msgTexts.splice(i, 1);
      localStorage.setItem("contactLogsArr", JSON.stringify(contactLogsArr));
      updateAllTexts(identifier.msgTexts);
      // console.log(identifier.msgTexts)
    }
  });
}

function scrollToBtmOfAllTexts() {
  msgAll.scrollTo({
    top: msgAll.scrollHeight,
    behavior: "smooth",
  });
}
async function sendSMS(to, msg) {
  try {
    const res = await fetch(
      `https://www.bulksmsnigeria.com/api/v2/sms/create?api_token=Ee40DkDyWQTMe3BC0HQQWq0dFuAnZYCs4i0N190XRgHyi9xr3orEcadullBW&from=Kola&to=${to}&body=${msg}`
    );

    if (!res.ok) {
      throw new Error("Failed to send SMS");
    }

    const data = await res.json();

    // console.log(data, '❤️');
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
}

function selectRcvrFromCt(arr) {
  /**
   * Selects a receiver from the contact list and performs various actions.
   *
   * @param {Array} arr - The array of contact objects.
   * @returns {void}
   */

  let html = "";
  arr.forEach((el) => {
    html += `<div class="msg-opts-list" data-index='${el.id}'>
        <img src=${el.img} alt="" class='msg-opts-list-img'>
        <h2>${el.firstName} ${el.lastName}<span>${el.phoneNo}</span></h2>
      </div>`;
  });
  msgOptsLists.innerHTML = html;

  const msgText = document.querySelector("#msgText");
  const dmForm = document.querySelector(".dm-form");

  //Selects who to message
  msgOptsLists.addEventListener("click", function (e) {
    if (e.target.classList.contains("msg-opts-list")) {
      const i = Number(e.target.dataset.index);
      identifier = arr.find((el) => el.id === i);
      msgDm.classList.remove("hidden");
      msgNew.classList.add("hidden");
      rcvrPic.src = identifier.img;
      rcvrName.textContent = `${identifier.firstName} ${identifier.lastName}`;
      updateAllTexts(identifier.msgTexts);
      scrollToBtmOfAllTexts();
    }
  });

  //Sends msg
  dmForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, 0);
    const min = String(now.getMinutes()).padStart(2, 0);
    sendSMS(identifier.phoneNo, msgText.value);
    // console.log(identifier.phoneNo, msgText.value)
    textAdded = true;
    identifier.msgTexts.push({
      msgTextValue: msgText.value,
      time: `${hrs}:${min}`,
    });
    updateAllTexts(identifier.msgTexts);
    scrollToBtmOfAllTexts();

    // console.log(contactLogsArr)
    localStorage.setItem("contactLogsArr", JSON.stringify(contactLogsArr));
    dmForm.reset();
    autoExpand(msgText);
  });

  //Go back to msg home page
  msgDmBack.addEventListener("click", function () {
    msgDm.classList.add("hidden");
    msgHome.classList.remove("hidden");
    msgHome.classList.add("slide");
    const rcvrIndex = msgSentListsArr.findIndex(
      (el) => el.phoneNo == identifier.phoneNo
    );
    if (rcvrIndex > -1) {
      msgSentListsArr.splice(rcvrIndex, 1);
      localStorage.setItem("msgSentListsArr", JSON.stringify(msgSentListsArr));
    }
    msgSentListsArr.unshift(identifier);
    if (!textAdded) return;
    updateSentMsgLists(msgSentListsArr);
    localStorage.setItem("msgSentListsArr", JSON.stringify(msgSentListsArr));
    textAdded = false;
  });

  //Delete all texts for a particular person
  delAllDm.addEventListener("click", function () {
    identifier.msgTexts = [];
    localStorage.setItem("contactLogsArr", JSON.stringify(contactLogsArr));
    msgAllContent.innerHTML = "";
  });
}

function delListFromSentMsg(i, identifier) {
  msgSentListsArr.splice(i, 1);
  updateSentMsgLists(msgSentListsArr);
  identifier.msgTexts = [];
  localStorage.setItem("contactLogsArr", JSON.stringify(contactLogsArr));
  localStorage.setItem("msgSentListsArr", JSON.stringify(msgSentListsArr));
}

function updateSentMsgLists(listsArr) {
  /**
   * Updates the display of the sent message lists in the message view.
   *
   * @param {Array} listsArr - An array of sent message lists to be displayed.
   * @returns {void}
   */

  let data = "";
  listsArr.forEach((el, i) => {
    data += `<div class="msg-list" data-index="${el.id}" data-indexx="${i}">
                    <img src="${el.img}" alt="" class="msg-list-img">
                    <h2>${el.firstName} ${el.lastName}<span>${
      el.msgTexts.length > 0 ? el.msgTexts.at(-1).msgTextValue : ""
    }</span></h2>
                    <div class="msg-list-bin">
                        <img src="img/trash3-fill.svg" alt="" class="msg-list-del">
                    </div>
                    <div class="last-msg-sent-time">${
                      el.msgTexts.length > 0 ? el.msgTexts.at(-1).time : ""
                    }</div>
                </div>`;
  });

  msgSentLists.innerHTML = data;

  const delListFromSentMsgBtn = document.querySelectorAll(".msg-list-del");

  //updates all the list on eact contact msg on the home page
  msgSentLists.addEventListener("click", function (e) {
    if (e.target.classList.contains("msg-list-img")) {
      const i = Number(e.target.closest(".msg-list").dataset.index);
      identifier = contactLogsArr.find((el) => el.id === i);
      msgDm.classList.remove("hidden");
      msgHome.classList.add("hidden");
      rcvrPic.src = identifier.img;
      rcvrName.textContent = `${identifier.firstName} ${identifier.lastName}`;
      updateAllTexts(identifier.msgTexts);
      scrollToBtmOfAllTexts();
    }
  });

  //delete a contact list from the msg home page which, clear all the texts in that contact
  delListFromSentMsgBtn.forEach((el) => {
    el.addEventListener("click", function () {
      const i = Number(el.closest(".msg-list").dataset.index);
      const uid = Number(el.closest(".msg-list").dataset.indexx);
      // console.log(uid, 'i')
      const identifier = contactLogsArr.find((el) => el.id === i);
      // console.log(identifier)
      delListFromSentMsg(uid, identifier);
    });
  });
}

export function msgInit() {
  /**
   * Initializes the messaging functionality.
   *
   * This function sets up event listeners and functionality for the messaging feature.
   * It handles actions such as switching between the home screen and the messaging screen,
   * searching for contacts, sending messages, and expanding text areas.
   *
   * @returns {void}
   */

  //Initailizing and updating msg sent contact lists
  selectRcvrFromCt(contactLogsArr);

  function homeMsgApp() {
    msgBtn[0].addEventListener("click", function () {
      homeScreen.classList.add("hidden");
      msg.classList.remove("hidden");
    });

    msgBack.addEventListener("click", function () {
      homeScreen.classList.remove("hidden");
      msg.classList.add("hidden");
      allAppScreen.classList.add("hidden");
    });
  }
  homeMsgApp();

  OtherAppsBtn.addEventListener("click", function () {
    msgBtn[1].addEventListener("click", function () {
      allApps.classList.add("hidden");
      msg.classList.remove("hidden");
      allAppScreen.classList.add("hidden");
    });

    msgBack.addEventListener("click", function () {
      allApps.classList.remove("hidden");
      msg.classList.add("hidden");
      homeScreen.classList.add("hidden");
      allAppScreen.classList.remove("hidden");
    });
  });

  gotoHomeBtn.addEventListener("click", function () {
    homeMsgApp();
  });

  msgDmSetting.addEventListener("click", function () {
    if (clickedDmSetting) {
      msgDmSettingContent.classList.add("hidden");
      clickedDmSetting = false;
    } else {
      msgDmSettingContent.classList.remove("hidden");
      clickedDmSetting = true;
    }
  });

  newMsgBtn.addEventListener("click", function () {
    msgHome.classList.add("hidden");
    msgNew.classList.remove("hidden");
    msgNew.classList.add("slideleft");
  });

  msgNewBack.addEventListener("click", function () {
    msgHome.classList.remove("hidden");
    msgNew.classList.add("hidden");
    msgHome.classList.add("slide");
  });

  msgInputSearch.addEventListener("input", function () {
    const searchValue = msgInputSearch.value.toLowerCase();
    const filteredSearch = msgSentListsArr.filter((el) => {
      const userData = `${el.firstName}${el.lastName}`.toLowerCase();
      return userData.includes(searchValue);
    });
    updateSentMsgLists(filteredSearch);
    // console.log(filteredSearch)
  });

  msgOptsInputSearch.addEventListener("input", function () {
    const searchValue = msgOptsInputSearch.value.toLowerCase();
    const filteredSearch = contactLogsArr.filter((el) => {
      const userData =
        `${el.firstName}${el.lastName}${el.phoneNo}`.toLowerCase();
      return userData.includes(searchValue);
    });

    selectRcvrFromCt(filteredSearch);
    // console.log(filteredSearch, '❤️❤️')
  });

  document.addEventListener(
    "input",
    function (event) {
      if (event.target.tagName.toLowerCase() === "textarea") {
        autoExpand(event.target);
      }
    },
    false
  );
}

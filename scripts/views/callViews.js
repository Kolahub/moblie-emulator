/**
 * This code snippet is a JavaScript module that handles a calling feature in a mobile app.
 * It provides functions for making calls, managing contact lists, displaying recent call logs, and handling balance information.
 * The module exports a function called callInit() that initializes the calling feature and sets up event listeners for various actions.
 * It also exports other helper functions for updating contact lists and recent call logs.
 * The code uses HTML elements and CSS classes to interact with the user interface.
 * It also uses audio files for playing calling sounds and stores data in local storage for persistence.
 */
import {
  homeScreen,
  OtherAppsBtn,
  gotoHomeBtn,
  allAppScreen,
  allApps,
} from "../index.js";
const call = document.querySelector(".call");
const callBackBtn = document.querySelector(".call-back");
const callBtn = document.querySelectorAll(".callBtn");
const callComp = document.querySelector(".call-comp");
const recentsLogs = document.querySelector(".call-recents");
const recentLists = document.querySelector(".recent-lists");
const delAllRecentLists = document.querySelector(".clear-all-recents");
const contactLogs = document.querySelector(".call-contacts");
const addContact = document.querySelector(".contacts-form");
const dialContact = document.querySelector(".contacts-dial");
const fileImgDisplay = document.querySelector("#fileImgDisplay");
const imgFile = document.querySelector("#file-upload");
const contactErrMsg = document.querySelector(".contact-err");
const contactLists = document.querySelector(".contact-lists");
const contactSearch = document.querySelector("#contactInputSearch");
const contactLine = document.querySelector(".contact-line");
const contactLineBack = document.querySelector(".contact-line-back");
const contactCalling = document.querySelector(".contact-calling");
const contactsKeypad = document.querySelector(".contacts-keypad");
const contactsBalance = document.querySelector(".contacts-balance");
const contactsBalanceInfo = document.querySelector(".contacts-balance-info");
const dismissBalanceInfo = document.querySelector(".contacts-balance-dismiss");

let clickLineFromContact = false;
let selectedContactImg = "img/person-circle.svg";
let airtelBalanceInit = 12;
let mtnBalanceInit = 10;
let airtime = JSON.parse(localStorage.getItem("airtime")) || {
  airtel: airtelBalanceInit,
  mtn: mtnBalanceInit,
};
let recentListsArr = JSON.parse(localStorage.getItem("recentListsArr")) || [];
export let contactLogsArr =
  JSON.parse(localStorage.getItem("contactLogsArr")) || [];
let contactListsHtml;
const phoneCallingAudio = new Audio("../audio/phone-calling.mp3");
let speakingAudioArr = [
  "../audio/audiocall1.mp3",
  "../audio/audiocall2.wav",
  "../audio/audiocall3.wav",
  "../audio/audiocall4.wav",
  "../audio/audiocall5.wav",
  "../audio/audiocall6.m4a",
  "../audio/audiocall7.mp3",
];
let speakingAudioC,
  timerInt,
  remainingAirtimeInt,
  phoneNoWithNoID,
  contactToCall;

let currentTimer = null; // Keep track of the current timer
let isAudioPlaying = false; // Track if the audio is playing

function readFileAsDataURL(file, callback) {
  /**
   * Reads a file as a data URL and invokes a callback function with the result.
   *
   * @param {File} file - The file to be read.
   * @param {function} callback - The callback function to be invoked with the data URL result.
   * @returns {void}
   */

  const reader = new FileReader();
  reader.onloadend = function () {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}

const delContact = function (i) {
  /**
   * Deletes a contact from the contact logs array and updates the contact lists.
   * @param {number} i - The index of the contact to be deleted.
   * @returns {void}
   */
  contactLogsArr.splice(i, 1);
  contactListsUpdate(contactLogsArr);
  localStorage.setItem("contactLogsArr", JSON.stringify(contactLogsArr));
};

const delRecent = function (i) {
  /**
   * Function: delRecent
   *
   * Description:
   * This function is responsible for deleting a recent item from the recentListsArr array.
   * It takes an index parameter (i) and removes the corresponding element from the array using the splice method.
   * Then, it updates the localStorage by storing the updated recentListsArr array as a JSON string.
   * Finally, it calls the recentListsUpdate function to update the UI with the updated recentListsArr array.
   *
   * Parameters:
   * - i (number): The index of the element to be deleted from the recentListsArr array.
   *
   * Returns:
   * - None
   */

  recentListsArr.splice(i, 1);
  localStorage.setItem("recentListsArr", JSON.stringify(recentListsArr));
  recentListsUpdate(recentListsArr);
};

const delAllRecent = function () {
  recentListsArr = [];
  localStorage.setItem("recentListsArr", JSON.stringify(recentListsArr));
  recentListsUpdate(recentListsArr);
};

function stopAudioAndTimer() {
  /**
   * Stops any playing audio and clears the timer.
   *
   * @returns {void}
   */
  if (isAudioPlaying) {
    speakingAudioC.pause();
    speakingAudioC.currentTime = 0;
    isAudioPlaying = false;
  }
  if (currentTimer) {
    clearTimeout(currentTimer);
    currentTimer = null;
  }
}

const dialContactNow = function (index, sim) {
  /**
   * Function: dialContactNow
   *
   * Description:
   * This function is responsible for dialing a contact. It takes two parameters, index and sim.
   * If the index is not empty, it finds the contact with the corresponding id in the contactLogsArr array.
   * Otherwise, it creates a new contact object with default values.
   * It then generates HTML for the contact calling screen and updates the UI.
   * The function also handles the calling timer, remaining airtime, and playing audio.
   * When the user clicks the quit calling button, it hides the contact calling screen, updates the recentListsArr array,
   * and clears the timer and audio.
   *
   * Parameters:
   * - index (string): The id of the contact in the contactLogsArr array. If empty, a new contact will be created.
   * - sim (string): The sim card used for the call.
   *
   * Returns:
   * - None
   */
  stopAudioAndTimer(); // Stop any playing audio or running timer

  let html = "";
  let obj;
  if (index !== "") {
    obj = contactLogsArr.find((el) => el.id === index);
    console.log(obj);
  } else {
    obj = {
      img: "img/person-circle.svg",
      firstName: "",
      lastName: "",
      phoneNo: phoneNoWithNoID,
    };
    // console.log(obj);
  }

  html = `<div class="contact-calling-info">
    <h1>${obj.firstName ? obj.firstName : obj.phoneNo} ${obj.lastName}</h1>
    <h2 class='calling-timer'>Calling mobile...</h2>
  </div>

  <div class="contact-calling-pic">
    <img src=${obj.img} alt="">
  </div>

  <div class="contact-calling-quit">
    <img src="img/telephone-fill.svg" alt="">
  </div>`;

  contactCalling.innerHTML = html;

  const callingTimer = document.querySelector(".calling-timer");
  const quitCalling = document.querySelector(".contact-calling-quit");

  function speakingAudio() {
    let i = Math.trunc(Math.random() * 6);
    speakingAudioC = new Audio(`${speakingAudioArr[i]}`);
    speakingAudioC.play();
    speakingAudioC.loop = true;
    // console.log(i)
  }

  function timer() {
    let hrs = 0;
    let min = 0;
    let sec = 0;

    timerInt = setInterval(() => {
      sec++;
      if (sec >= 60) {
        sec = 0;
        min++;
      }
      if (min >= 60) {
        sec = 0;
        min = 0;
        hrs++;
      }

      callingTimer.textContent = `${hrs.toString().padStart(2, 0)}:${min
        .toString()
        .padStart(2, 0)}:${sec.toString().padStart(2, 0)}`;
      // console.log(
      //   `${hrs.toString().padStart(2, 0)}:${min.toString().padStart(2, 0)}:${sec
      //     .toString()
      //     .padStart(2, 0)}`
      // );
    }, 1000);
  }

  function remainingAirtime() {
    remainingAirtimeInt = setInterval(() => {
      airtime[sim] = airtime[sim] - 0.5;
      localStorage.setItem("airtime", JSON.stringify(airtime));
      airtime = JSON.parse(localStorage.getItem("airtime"));
    }, 3000);
  }

  currentTimer = setTimeout(() => {
    phoneCallingAudio.pause();
    timer();
    remainingAirtime();
    speakingAudio();
    isAudioPlaying = true;
  }, 3000);

  quitCalling.addEventListener("click", function () {
    contactLine.classList.add("hidden");
    contactCalling.classList.add("hidden");
    contactLogs.classList.remove("hidden");
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, 0);
    const min = String(now.getMinutes()).padStart(2, 0);
    obj.time = `${hrs}:${min}`;

    recentListsArr.push(obj);
    localStorage.setItem("recentListsArr", JSON.stringify(recentListsArr));
    recentListsUpdate(recentListsArr);
    phoneCallingAudio.pause();
    clickLineFromContact = false;

    // Clear timer interval
    clearInterval(timerInt);

    clearInterval(remainingAirtimeInt);

    // Pause and reset audio if it exists
    if (speakingAudioC) {
      speakingAudioC.pause();
      speakingAudioC.currentTime = 0;
    }

    clearTimeout(currentTimer);
  });
};

function contactListsUpdate(arr) {
  /**
   * Updates the contact lists in the UI based on the provided array of contacts.
   * @param {Array} arr - The array of contacts to be displayed in the contact lists.
   * @returns {void}
   */
  contactListsHtml = "";
  arr.forEach((el, i) => {
    contactListsHtml += `<div class="contact-list">
        <img src=${el.img} alt="" class='contact-list-img'>
        <h2>${el.firstName} ${el.lastName}<span>${el.phoneNo}</span></h2>
        <div class="contact-list-bin" data-index='${el.id}'>
        <img src="img/trash3-fill.svg" alt="" class="contact-list-del" >
      </div>
      </div>`;
  });

  contactLists.innerHTML = contactListsHtml;

  if (!document.querySelector(".contact-list-del")) return;
  const delContactBtn = document.querySelectorAll(".contact-list-bin");

  delContactBtn.forEach((el) => {
    el.addEventListener("click", function () {
      const index = Number(el.dataset.index);
      delContact(index);
      console.log(index, "❤️❤️");
    });
  });

  contactLists.addEventListener("click", function (e) {
    if (e.target.classList.contains("contact-list")) {
      const indexEl = e.target.querySelector(".contact-list-bin").dataset.index;
      contactToCall = Number(indexEl);
      clickLineFromContact = true;
      contactLine.classList.remove("hidden");
      console.log(contactToCall);
    }
  });

  contactLine.addEventListener("click", function (e) {
    if (clickLineFromContact) {
      if (e.target.classList.contains("sim1")) {
        contactLine.classList.add("hidden");
        contactCalling.classList.remove("hidden");
        contactLogs.classList.add("hidden");
        phoneCallingAudio.play();
        dialContactNow(contactToCall, "airtel");
      }

      if (e.target.classList.contains("sim2")) {
        contactLine.classList.add("hidden");
        contactCalling.classList.remove("hidden");
        contactLogs.classList.add("hidden");
        phoneCallingAudio.play();
        dialContactNow(contactToCall, "mtn");
      }
    }
  });
}

function recentListsUpdate(arr) {
  /**
   * Function: recentListsUpdate
   *
   * Description:
   * This function is responsible for updating the UI with the recentListsArr array.
   * It takes an array (arr) as a parameter and generates HTML for each element in the array.
   * The generated HTML includes the contact's name, phone number, time of call, and a delete button.
   * The function then updates the UI by setting the innerHTML of the recentLists element to the generated HTML.
   *
   * Parameters:
   * - arr (array): The array containing the recent call logs.
   *
   * Returns:
   * - None
   */

  let html = "";
  arr.forEach((el, i) => {
    html =
      `<div class="call-recents-pern">
        <h2>${el.firstName ? el.firstName : el.phoneNo} ${el.lastName}<span>${
        el.firstName ? el.phoneNo : ""
      }</span></h2>
        <div class="call-recents-handler">
          <h3>${el.time}</h3> 
          <div class="recent-list-x" data-index='${i}'>
          <img src="img/x-circle-fill.svg" alt="" class='del-recentList'/>
        </div>
        </div>
      </div>` + html;
  });

  recentLists.innerHTML = html;

  if (!document.querySelector(".call-recents-pern")) return;

  const delRecentBtn = document.querySelectorAll(".recent-list-x");
  delRecentBtn.forEach((el) => {
    el.addEventListener("click", function () {
      const index = Number(el.dataset.index);
      delRecent(index);
    });
  });
}

export function callInit() {
  /**
   * Initializes the call functionality of the application.
   *
   * This function sets up event listeners and handles various actions related to making calls.
   * It also updates the contact and recent lists, and handles user interactions with the call component.
   *
   * @returns {void}
   */

  function homeCallApp() {
    callBtn[0].addEventListener("click", function () {
      homeScreen.classList.add("hidden");
      call.classList.remove("hidden");
    });

    callBackBtn.addEventListener("click", function () {
      homeScreen.classList.remove("hidden");
      call.classList.add("hidden");
      allAppScreen.classList.add("hidden");
    });
  }
  homeCallApp();

  OtherAppsBtn.addEventListener("click", function () {
    callBtn[1].addEventListener("click", function () {
      allApps.classList.add("hidden");
      call.classList.remove("hidden");
      allAppScreen.classList.add("hidden");
    });

    callBackBtn.addEventListener("click", function () {
      allApps.classList.remove("hidden");
      call.classList.add("hidden");
      homeScreen.classList.add("hidden");
      allAppScreen.classList.remove("hidden");
    });
  });

  gotoHomeBtn.addEventListener("click", function () {
    homeCallApp();
  });

  contactListsUpdate(contactLogsArr);
  recentListsUpdate(recentListsArr);
  console.log(contactLogsArr);
  contactLineBack.addEventListener("click", function () {
    contactLine.classList.add("hidden");
  });
  callComp.addEventListener("click", function (e) {
    if (e.target.classList.contains("recentBtn")) {
      recentsLogs.classList.remove("hidden");
      recentsLogs.classList.add("slide");
      contactLogs.classList.add("hidden");
      dialContact.classList.add("hidden");
    }

    if (e.target.classList.contains("contactBtn")) {
      recentsLogs.classList.add("hidden");
      contactLogs.classList.remove("hidden");
      contactLogs.classList.add("slide");
      dialContact.classList.add("hidden");
    }

    if (e.target.classList.contains("dailBtn")) {
      recentsLogs.classList.add("hidden");
      contactLogs.classList.add("hidden");
      dialContact.classList.add("slide");
      dialContact.classList.remove("hidden");
    }
  });

  contactLogs.addEventListener("click", function (e) {
    if (e.target.classList.contains("add-contact")) {
      contactLogs.classList.add("hidden");
      addContact.classList.remove("hidden");
      addContact.classList.add("slideleft");
    }
  });

  delAllRecentLists.addEventListener("click", delAllRecent);

  addContact.addEventListener("click", function (e) {
    const contactInfo = document.querySelector(".contacts-form-comp");
    if (e.target.classList.contains("contacts-form-cancel")) {
      addContact.classList.add("hidden");
      contactLogs.classList.remove("hidden");
      contactLogs.classList.add("slide");
      selectedContactImg = "img/person-circle.svg";
      fileImgDisplay.src = selectedContactImg;
      contactInfo.reset();
    }

    if (e.target.classList.contains("contacts-form-done")) {
      const checkForPhoneNo = contactLogsArr.find(
        (el) => el.phoneNo === contactInfo.phoneno.value
      );
      if (checkForPhoneNo) {
        contactErrMsg.textContent = "Error! Phone number already exists.";
        contactErrMsg.classList.remove("hidden");

        setTimeout(() => {
          contactErrMsg.classList.add("hidden");
        }, 3000);
        return;
      }

      if (contactInfo.firstname.value && contactInfo.phoneno.value) {
        let obj = {
          img: selectedContactImg,
          firstName: contactInfo.firstname.value,
          lastName: contactInfo.lastname.value,
          phoneNo: contactInfo.phoneno.value,
          msgTexts: [],
        };

        contactLogsArr.push(obj);

        contactLogsArr.forEach((el, i) => {
          el.id = i;
        });

        contactListsUpdate(contactLogsArr);
        addContact.classList.add("hidden");
        contactLogs.classList.remove("hidden");
        contactLogs.classList.add("slide");
        selectedContactImg = "img/person-circle.svg";
        fileImgDisplay.src = selectedContactImg;
        localStorage.setItem("contactLogsArr", JSON.stringify(contactLogsArr));
        contactInfo.reset();
        // console.log(contactLogsArr);
      } else {
        contactErrMsg.textContent =
          "Error! please you must fill in the first name and phone number.";
        contactErrMsg.classList.remove("hidden");
        setTimeout(() => {
          contactErrMsg.classList.add("hidden");
        }, 3000);
      }
    }
  });

  imgFile.addEventListener("change", function () {
    const file = imgFile.files[0];
    readFileAsDataURL(file, function (dataURL) {
      selectedContactImg = dataURL;
      fileImgDisplay.src = selectedContactImg;
    });
  });

  contactSearch.addEventListener("input", function () {
    const searchValue = contactSearch.value.toLowerCase();
    const filteredSearch = contactLogsArr.filter((el) => {
      const userData =
        `${el.firstName}${el.lastName}${el.phoneNo}`.toLocaleLowerCase();
      return userData.includes(searchValue);
    });
    contactListsUpdate(filteredSearch);
    // console.log(filteredSearch)
  });

  contactsKeypad.addEventListener("click", function (e) {
    let num = e.target
      .closest(".contacts-dial")
      .querySelector(".contacts-dial-num");
    if (e.target.classList.contains("num-btn")) {
      // console.log(num)
      num.textContent += e.target.textContent;
    }

    if (e.target.classList.contains("dial-keypad")) {
      contactLine.classList.remove("hidden");
      contactLine.addEventListener("click", function (e) {
        if (clickLineFromContact) return;
        if (e.target.classList.contains("sim1")) {
          if (num.textContent.endsWith("#")) {
            if (num.textContent === "*123#") {
              contactsBalanceInfo.textContent = `XtraValue Main Account: N${Number(
                airtime.airtel
              ).toFixed(2)}. Details via sms.`;
            } else if (
              num.textContent.startsWith("*311*") &&
              num.textContent.endsWith("#")
            ) {
              airtime.airtel += 100;
              contactsBalanceInfo.textContent = `Your Recharge is successful. Your Airtime balance is now: N${Number(
                airtime.airtel
              ).toFixed(2)}`;
              localStorage.setItem("airtime", JSON.stringify(airtime));
            } else {
              contactsBalanceInfo.textContent =
                "Error! wrong pin. Please Try Again";
            }
            contactsBalance.classList.remove("hidden");
          }

          if (
            !num.textContent.includes("#") &&
            !num.textContent.includes("*")
          ) {
            let getContact = contactLogsArr.find(
              (el) => el.phoneNo === num.textContent
            );
            if (getContact) {
              let index = Number(getContact.id);
              contactCalling.classList.remove("hidden");
              dialContactNow(index, "airtel");
              // console.log('id')
            }
            if (!getContact) {
              phoneNoWithNoID = num.textContent;
              contactCalling.classList.remove("hidden");
              dialContactNow("", "airtel");
              // console.log('no id')
            }
          }

          contactLine.classList.add("hidden");
          dialContact.classList.add("hidden");
        }

        if (e.target.classList.contains("sim2")) {
          if (num.textContent.endsWith("#")) {
            if (num.textContent === "*310#") {
              contactsBalanceInfo.textContent = `XtraValue Main Account: N${Number(
                airtime.mtn
              ).toFixed(2)}. Details via sms.`;
            } else if (
              num.textContent.startsWith("*555*") &&
              num.textContent.endsWith("#")
            ) {
              airtime.mtn += 100;
              contactsBalanceInfo.textContent = `Your Recharge is successful. Your Airtime balance is now: N${Number(
                airtime.mtn
              ).toFixed(2)}`;
              localStorage.setItem("airtime", JSON.stringify(airtime));
            } else {
              contactsBalanceInfo.textContent =
                "Error! wrong pin. Please Try Again";
            }

            contactsBalance.classList.remove("hidden");
          }

          if (
            !num.textContent.includes("#") &&
            !num.textContent.includes("*")
          ) {
            let getContact = contactLogsArr.find(
              (el) => el.phoneNo === num.textContent
            );
            if (getContact) {
              phoneCallingAudio.play();
              let index = Number(getContact.id);
              dialContactNow(index, "mtn");
              // console.log('id')
            }
            if (!getContact) {
              phoneCallingAudio.play();
              phoneNoWithNoID = num.textContent;
              dialContactNow("", "mtn");
              // console.log('no id')
            }

            contactCalling.classList.remove("hidden");
          }

          contactLine.classList.add("hidden");
          dialContact.classList.add("hidden");
        }
      });
    }

    if (e.target.classList.contains("backspace")) {
      num.textContent = num.textContent.slice(0, -1);
      // console.log(num)
    }
  });

  dismissBalanceInfo.addEventListener("click", function () {
    contactsBalance.classList.add("hidden");
    dialContact.classList.remove("hidden");
  });
}

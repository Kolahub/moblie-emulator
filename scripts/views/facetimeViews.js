/**
 * This code snippet exports a function called `facetimeInit` that initializes a video conferencing feature.
 *
 * The function listens for a click event on a button with the class "facetimeBtn". When the button is clicked, it performs the following actions:
 * 1. Removes the "hidden" class from an element with the class "facetime".
 * 2. Adds the "hidden" class to elements with the classes "allAppScreen" and "allApps".
 * 3. Generates a random string of length 30 using uppercase letters, lowercase letters, and numbers.
 * 4. Creates an object called `options` with properties for the video conferencing room name, width, height, parent node, and user information.
 * 5. Initializes a JitsiMeetExternalAPI instance with the domain "meet.jit.si" and the generated options.
 * 6. Listens for the "participantJoined" and "participantLeft" events on the JitsiMeetExternalAPI instance.
 *
 * The function also listens for a click event on a button with the class "facetime-back". When the button is clicked, it performs the following actions:
 * 1. Adds the "hidden" class to an element with the class "facetime".
 * 2. Removes the "hidden" class from elements with the classes "allAppScreen" and "allApps".
 * 3. Disposes the JitsiMeetExternalAPI instance and clears the console if it exists.
 */
import { allAppScreen, allApps } from "../index.js";
const facetimeBtn = document.querySelector(".facetimeBtn");
const facetime = document.querySelector(".facetime");
const facetimeBack = document.querySelector(".facetime-back");

let api; // Declare api variable outside the event listeners

export function facetimeInit() {
  facetimeBtn.addEventListener("click", function () {
    facetime.classList.remove("hidden");
    allAppScreen.classList.add("hidden");
    allApps.classList.add("hidden");

    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var stringLength = 30;

    function pickRandom() {
      return possible[Math.floor(Math.random() * possible.length)];
    }

    var randomString = Array.apply(null, Array(stringLength))
      .map(pickRandom)
      .join("");
    const domain = "meet.jit.si";
    const options = {
      roomName: randomString,
      width: "100%",
      height: "100%",
      parentNode: document.querySelector("#meet"),
      userInfo: {
        displayName: "Ayofe Faheez",
      },
    };

    api = new JitsiMeetExternalAPI(domain, options);

    api.addEventListener("participantJoined", () => {
      // console.log("Participant joined the meeting");
    });

    api.addEventListener("participantLeft", () => {
      // console.log("Participant left the meeting");
    });
  });

  facetimeBack.addEventListener("click", function () {
    facetime.classList.add("hidden");
    allAppScreen.classList.remove("hidden");
    allApps.classList.remove("hidden");
    // Dispose Jitsi API instance when back button is clicked
    if (api) {
      api.dispose();
      console.clear();
    }
  });
}

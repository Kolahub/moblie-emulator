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

    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var stringLength = 30;

    function pickRandom() {
    return possible[Math.floor(Math.random() * possible.length)];
    }

var randomString = Array.apply(null, Array(stringLength)).map(pickRandom).join('');
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
      console.log("Participant joined the meeting");
    });

    api.addEventListener("participantLeft", () => {
      console.log("Participant left the meeting");
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

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

    const domain = "meet.jit.si";
    const options = {
      roomName: "YourRoomName",
      width: "100%",
      height: "100%",
      parentNode: document.querySelector("#meet"),
      userInfo: {
        displayName: "Ayofe Faheez",
      },
    };

    api = new JitsiMeetExternalAPI(domain, options);

    api.addEventListener("participantJoined", (e) => {
      console.log("Participant joined the meeting", e.displayName, '❤️');
    });

    api.addEventListener("participantLeft", (e) => {
      console.log("Participant left the meeting", e.displayName, '❤️');
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

import { allAppScreen, allApps } from "../index.js";
// ***** SELECT ITEMS FOR AGE CALCULATOR ********
const ageCalBtn = document.querySelector(".ageCalBtn");
const ageCal = document.querySelector(".ageCal");
const dayValue = document.querySelector(".input__day");
const monthValue = document.querySelector(".input__month");
const yearValue = document.querySelector(".input__year");
const yearNum = document.querySelector(".year_num");
const monthNum = document.querySelector(".month_num");
const dayNum = document.querySelector(".day_num");
const btn = document.querySelector(".svg");
const inputBox = document.querySelectorAll(".inputBox");
const labelBox = document.querySelectorAll(".labelBox");
const emptyText = document.querySelectorAll(".empty__text");
const resetBtn = document.querySelector(".reset--btn");
const ageCalBack = document.querySelector(".ageCal-back");

export function ageCalInit() {
  // AGE CALCULATOR FUNCTIONALITY
  ageCalBtn.addEventListener("click", function () {
    allApps.classList.add("hidden");
    ageCal.classList.remove("hidden");
    allAppScreen.classList.add("hidden");
    console.log("wefwe");
  });
  const ResetDisplayedValues = function () {
    yearNum.textContent = "- -";
    monthNum.textContent = "- -";
    dayNum.textContent = "- -";
  };
  //  Resets the values and styles of various elements in the HTML document.
  const init = function () {
    // Reset displayed values
    ResetDisplayedValues();

    // Clear input values
    dayValue.value = "";
    monthValue.value = "";
    yearValue.value = "";

    // Reset button background color
    btn.style.backgroundColor = "";

    // Hide empty text elements
    emptyText.forEach((element) => {
      element.classList.add("hidden");
    });

    // Remove input box highlight
    inputBox.forEach((element) => {
      element.classList.remove("inputBoxH");
    });

    // Remove label box highlight
    labelBox.forEach((element) => {
      element.classList.remove("labelBoxH");
    });
  };

  init();

  // ** CURRENT FULL DATE VARIABLES ************
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth() + 1;
  let currentDay = new Date().getDate();
  const monthArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const some = function () {
    // Change background color of btn element to black
    btn.style.backgroundColor = "black";
    // Adjust current day and month if necessary
    if (dayValue.value > currentDay) {
      currentDay += monthArr[currentMonth - 1];
      currentMonth--;
    }

    if (monthValue.value > currentMonth) {
      currentMonth += 12;
      currentYear--;
    }

    // Calculate and display the difference
    dayNum.textContent = currentDay - dayValue.value;
    monthNum.textContent = currentMonth - monthValue.value;
    yearNum.textContent = currentYear - yearValue.value;

    // Validate input values
    for (const [i, inputData] of inputBox.entries()) {
      if (
        i === 0 &&
        (inputData.value === "" ||
          inputData.value <= 0 ||
          inputData.value >= 30)
      ) {
        showError(
          emptyText[0],
          inputBox[0],
          labelBox[0],
          "must be a valid day"
        );
      } else if (
        i === 1 &&
        (inputData.value === "" || inputData.value <= 0 || inputData.value > 12)
      ) {
        showError(
          emptyText[1],
          inputBox[1],
          labelBox[1],
          "must be a valid month"
        );
      } else if (
        i === 2 &&
        (inputData.value === "" ||
          inputData.value <= 0 ||
          inputData.value > currentYear)
      ) {
        showError(
          emptyText[2],
          inputBox[2],
          labelBox[2],
          "must be a valid year"
        );
      }
    }
  };

  function showError(errorText, input, label, message) {
    errorText.classList.remove("hidden");
    input.classList.add("inputBoxH");
    label.classList.add("labelBoxH");
    errorText.textContent = message;
    // Reset displayed values
    ResetDisplayedValues();
  }

  // Add event listener to btn element
  btn.addEventListener("click", some);

  // Add event listener to resetBtn element
  resetBtn.addEventListener("click", init);

  ageCalBack.addEventListener("click", function () {
    allApps.classList.remove("hidden");
    ageCal.classList.add("hidden");
    allAppScreen.classList.remove("hidden");
  });
}

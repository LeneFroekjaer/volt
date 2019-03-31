"use strict";
// the getElementsByClassName returns an array-like object of all child elements which have all of the given class names. In this case, it will be step.
let step = document.getElementsByClassName("step");

// The currentStep is the step we would like to be at.
// 0 is the step with the cart. 1 is the step with the registrer. And 2 is the step with the payment.
// We will start at 0 (the cart).
let currentStep = 0;

showStep(currentStep);

// SHOW THE CURRENT STEP
function showStep(number) {
  // This will show the current step.
  step[number].style.display = "block";

  // PROGRESS BAR
  // The width of the progress bar depends on the current step
  let progressbar = document.querySelector("#power");
  if (number == 1) {
    progressbar.style.width = "65.5%";

    document.querySelector("#step_title_1").classList.remove("selected_step");
    document.querySelector("#step_title_2").classList.add("selected_step");
  } else if (number == 2) {
    progressbar.style.width = "100%";

    document.querySelector("#step_title_2").classList.remove("selected_step");
    document.querySelector("#step_title_3").classList.add("selected_step");

    // change the text of the button
    document.querySelector("#next_step").innerHTML = "Complete payment";
  }
}

// CONTINUE-BUTTON
document.querySelector("#next_step").addEventListener("click", nextStep);
function nextStep() {
  // Removes the current step.
  step[currentStep].style.display = "none";

  // Increases the current step by one
  currentStep = currentStep + 1;

  // passes on value of the new currentStep.
  showStep(currentStep);
}

"use strict";
window.addEventListener("DOMContentLoaded", init);

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
///////////////// GLOBALS VARIABLES

const form = document.querySelector("form");

// the getElementsByClassName returns an array-like object of all child elements which have all of the given class names. In this case, it will be step.
const step = document.getElementsByClassName("step");

// The currentStep is the step we would like to be at.
// 0 is the step with the cart. 1 is the step with the registrer. And 2 is the step with the payment.
// We will start at 0 (the cart).
let currentStep = 0;

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
///////////////// STARTING FUNCTION

function init() {
  showStep(currentStep); // Go to the form
  calculatePrice(); // go to ekstra
  document
    .querySelector("#next_step")
    .addEventListener("click", sendValidation); // go to validation
  sendToSummary(); // go to summary
  questionMark(); // go to ekstra
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
///////////////// THE FORM

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

    summaryReg();
  } else if (number == 2) {
    progressbar.style.width = "100%";

    document.querySelector("#step_title_2").classList.remove("selected_step");
    document.querySelector("#step_title_3").classList.add("selected_step");

    // change the text of the button
    //document.querySelector("#next_step").innerHTML = "Complete payment";
    document.querySelector("#next_step").style.display = "none";
    document.querySelector("#submit").style.display = "block";

    summaryPay();
  }
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// VALIDATION

function sendValidation() {
  if (document.querySelector(".stepCart").style.display == "block") {
    validateCart();
  } else if (
    document.querySelector(".stepRegistrer").style.display == "block"
  ) {
    validateRegistrer();
  }
}

function validateCart() {
  let valDelivery = document.getElementById("new_pick_up");
  if (valDelivery.checkValidity()) {
    console.log("validates!");
    nextStep();
  } else if (form.elements.new_charger.value == 0) {
    nextStep();
    console.log("0!");
  } else {
    console.log("Doesn't validate!");
    valDelivery.classList.add("check_validation");
  }
}

function validateRegistrer() {
  console.log("Checking!");
  let valFirstname = document.getElementById("new_firstname");
  let valLastname = document.getElementById("new_lastname");
  let valPhone = document.getElementById("new_phone");
  let valEmail = document.getElementById("new_email");
  let valPassword = document.getElementById("new_password");
  let valTerms = document.getElementById("new_terms");

  if (
    valFirstname.checkValidity() &&
    valLastname.checkValidity() &&
    valPhone.checkValidity() &&
    valEmail.checkValidity() &&
    valPassword.checkValidity() &&
    valTerms.checkValidity()
  ) {
    console.log("validates!");
    nextStep();
  }
  valFirstname.classList.add("check_validation");
  valLastname.classList.add("check_validation");
  valPhone.classList.add("check_validation");
  valEmail.classList.add("check_validation");
  valPassword.classList.add("check_validation");
  valTerms.classList.add("check_validation");
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// CONTINUE-BUTTON

function nextStep() {
  // Removes the current step.
  step[currentStep].style.display = "none";

  // Increases the current step by one
  currentStep = currentStep + 1;

  // passes on value of the new currentStep.
  showStep(currentStep);
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
///////////////// THE DATABASE
// Key to json (x-apikey): 5ca0f5bfdf5d634f46ecb0ca
// JSON homepage: https://keaprojects-9fe5.restdb.io/home/db/5c9e05e52976c93200005ee4/cards/5c9e06c42976c93200005f09
// JSON file: https://keaprojects-9fe5.restdb.io/rest/volt

// POST

function post(data) {
  const postData = JSON.stringify(data);
  fetch("https://keaprojects-9fe5.restdb.io/rest/volt", {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5ca0f5bfdf5d634f46ecb0ca",
      "cache-control": "no-cache"
    },
    body: postData
  })
    .then(res => res.json())
    .then(data => {
      form.elements.submit.disabled = false;
      form.reset();
      self.location = "responds.html";
    });
  //showUser(data); // go to GET
}

// add Task / submit
form.setAttribute("novalidate", true);
form.addEventListener("submit", e => {
  form.elements.submit.disabled = true;
  const data = {
    firstname: form.elements.new_firstname.value,
    lastname: form.elements.new_lastname.value,
    email: form.elements.new_email.value,
    password: form.elements.new_password.value,
    country: form.elements.new_country.value,
    phone: form.elements.new_phone.value,
    voltcharger: form.elements.new_charger.value,
    swapping: form.elements.new_swap.value,
    delivery: form.elements.new_delivery.value
  };
  e.preventDefault();
  post(data);
});

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// SUMMARY

function sendToSummary() {
  let newSwap = document.querySelector("#new_swap");
  let newCharger = document.querySelector("#new_charger");
  let newFirst = document.querySelector("#new_firstname");
  let newLast = document.querySelector("#new_lastname");
  let newPhone = document.querySelector("#new_phone");
  let newEmail = document.querySelector("#new_email");

  // SHOW IN THE SUMMARY (CART-SITE) when clicked og pressed down a key in the input-field
  newSwap.addEventListener("keyup", summaryReg);
  newCharger.addEventListener("keyup", summaryReg);
  newSwap.addEventListener("click", summaryReg);
  newCharger.addEventListener("click", summaryReg);
  document.querySelector("#new_pick_up").addEventListener("click", summaryReg);
  document.querySelector("#new_ship").addEventListener("click", summaryReg);

  // SHOW IN THE SUMMARY (REGISTRER-SITE)
  newFirst.addEventListener("keyup", summaryPay);
  newFirst.addEventListener("click", summaryPay);
  newLast.addEventListener("keyup", summaryPay);
  newLast.addEventListener("click", summaryPay);
  newPhone.addEventListener("keyup", summaryPay);
  newPhone.addEventListener("click", summaryPay);
  newEmail.addEventListener("keyup", summaryPay);
  newEmail.addEventListener("click", summaryPay);
  document.querySelector("#new_country").addEventListener("click", summaryPay);
}

function summaryReg() {
  removeDelivery();

  document.querySelector(".sum_order").style.display = "block";

  document.querySelector("#sumCharger").textContent =
    form.elements.new_charger.value + " volt pocket chargers";
  document.querySelector("#sumSwap").textContent =
    form.elements.new_swap.value + " times swapping per day";

  if (form.elements.new_delivery.value == "Shipping to your address") {
    document.querySelector("#sumTotal").textContent =
      Number(form.elements.new_swap.value) * 179 +
      Number(form.elements.new_charger.value) * 200 +
      50;
  } else {
    document.querySelector("#sumTotal").textContent =
      Number(form.elements.new_swap.value) * 179 +
      Number(form.elements.new_charger.value) * 200;
  }

  document.querySelector("#sumDeposit").textContent =
    Number(form.elements.new_charger.value) * 200;

  document.querySelector("#sumDelivery").textContent =
    form.elements.new_delivery.value;
}

function summaryPay() {
  document.querySelector(".sum_account").style.display = "block";

  document.querySelector("#sumName").textContent =
    form.elements.new_firstname.value + " " + form.elements.new_lastname.value;
  document.querySelector("#sumCountry").textContent =
    form.elements.new_country.value;
  document.querySelector("#sumPhone").textContent =
    form.elements.new_phone.value;
  document.querySelector("#sumEmail").textContent =
    form.elements.new_email.value;
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
///////////////// EKSTRA

// CALCULATE PRICES
function calculatePrice() {
  document
    .querySelector("#new_charger")
    .addEventListener("blur", calculateChargerPrice);
  document
    .querySelector("#new_swap")
    .addEventListener("blur", calculateSwapPrice);
}

function calculateChargerPrice() {
  document.querySelector("#price_charger").textContent =
    Number(form.elements.new_charger.value) * 200 + " DKK (Refundable)";
}
function calculateSwapPrice() {
  document.querySelector("#price_swap").textContent =
    Number(form.elements.new_swap.value) * 179 + " DKK";
  document.querySelector(".linethrough_price").textContent =
    ((Number(form.elements.new_swap.value) * 179 * 100) / 71.6).toFixed(0) +
    " DKK";
}

// REMOVE DELIVERY-SECTION
function removeDelivery() {
  if (form.elements.new_charger.value < 1) {
    document.querySelector("#delivery_wrapper").style.display = "none";
  } else {
    document.querySelector("#delivery_wrapper").style.display = "block";
  }
}

// QUESTION-MARK
function questionMark() {
  document
    .querySelector(".question_charger")
    .addEventListener("click", qCharger);
  document.querySelector(".question_swap").addEventListener("click", qSwap);
}

function qCharger() {
  document.querySelector("#question_swap_info").style.display = "none";
  document.querySelector("#question_charger_info").style.display = "block";
  document.querySelector(".close_charger").addEventListener("click", removeQ);
}

function qSwap() {
  document.querySelector("#question_charger_info").style.display = "none";
  document.querySelector("#question_swap_info").style.display = "block";
  document.querySelector(".close_swap").addEventListener("click", removeQ);
}

function removeQ() {
  document.querySelector("#question_swap_info").style.display = "none";
  document.querySelector("#question_charger_info").style.display = "none";
  document
    .querySelector(".question_charger")
    .addEventListener("click", qCharger);
}

"use strict";
window.addEventListener("DOMContentLoaded", init);
const form = document.querySelector("form");

// the getElementsByClassName returns an array-like object of all child elements which have all of the given class names. In this case, it will be step.
const step = document.getElementsByClassName("step");

// The currentStep is the step we would like to be at.
// 0 is the step with the cart. 1 is the step with the registrer. And 2 is the step with the payment.
// We will start at 0 (the cart).
let currentStep = 0;

function init() {
  showStep(currentStep); // the form
  get(); // the database
  calculatePrice(); // ekstra

  document.querySelector("#next_step").addEventListener("click", nextStep);
}

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

// CONTINUE-BUTTON

function nextStep() {
  // Removes the current step.
  step[currentStep].style.display = "none";

  // Increases the current step by one
  currentStep = currentStep + 1;

  // passes on value of the new currentStep.
  showStep(currentStep);
}

///////////////// THE DATABASE
// Key to json (x-apikey): 5ca0f5bfdf5d634f46ecb0ca
// JSON homepage: https://keaprojects-9fe5.restdb.io/home/db/5c9e05e52976c93200005ee4/cards/5c9e06c42976c93200005f09
// JSON file: https://keaprojects-9fe5.restdb.io/rest/volt

// GET
function get() {
  fetch("https://keaprojects-9fe5.restdb.io/rest/volt", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5ca0f5bfdf5d634f46ecb0ca",
      "cache-control": "no-cache"
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      data.forEach(showUser);
    });
}

function showUser(user) {
  const template = document.querySelector("template").content;
  const clone = template.cloneNode(true);

  clone.querySelector("#firstname").textContent = user.firstname;
  clone.querySelector("#lastname").textContent = user.lastname;
  clone.querySelector("#email").textContent = user.email;
  clone.querySelector("#password").textContent = user.password;
  clone.querySelector("#country").textContent = user.country;
  clone.querySelector("#phone").textContent = user.phone;
  clone.querySelector("#charger").textContent = user.voltcharger;
  clone.querySelector("#swap").textContent = user.swapping;
  clone.querySelector("#delivery").textContent = user.delivery;

  document.querySelector("section").appendChild(clone);
}
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
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
    });
  showUser(data); // go to GET
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
  console.log(form);
  console.log("submitted");
  post(data);
});

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// SUMMARY

function summaryReg() {
  document.querySelector(".sum_order").style.display = "block";

  document.querySelector("#sumCharger").textContent =
    form.elements.new_charger.value + " volt pocket chargers";
  document.querySelector("#sumSwap").textContent =
    form.elements.new_swap.value + " times swapping per day";
  document.querySelector("#sumTotal").textContent =
    Number(form.elements.new_swap.value) * 179 +
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

///////////////// EKSTRA
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
}

const burger = document.getElementById("menu");
const mobileNav = document.getElementById("mobileNav");
if (burger && mobileNav) {
  burger.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("hidden") === false;
    mobileNav.classList.toggle("flex", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
  });
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.add("hidden");
      mobileNav.classList.remove("flex");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const tel = document.getElementById("tel");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const hoursInput = document.getElementById("hours");

if (!form) {
  // form not present on this page — bail out of form wiring
} else {

const today = new Date().toISOString().split("T")[0];
dateInput.min = today;

nameInput.addEventListener("input", function () {
  this.value = this.value.replace(/\d/g, "");
});

tel.addEventListener("focus", function () {
  if (!this.value) this.value = "+380";
});

function getErrorMessage(input) {
  const v = input.validity;
  if (v.valid) return "";

  switch (input.id) {
    case "name":
      if (v.valueMissing) return "Будь ласка, введіть ім'я";
      if (v.tooShort) return "Ім'я має містити мінімум 2 символи";
      if (v.patternMismatch) return "Ім'я може містити лише літери";
      break;
    case "tel":
      if (v.valueMissing) return "Будь ласка, введіть номер телефону";
      if (v.patternMismatch) return "Введіть номер у форматі +380XXXXXXXXX";
      break;
    case "date":
      if (v.valueMissing) return "Будь ласка, виберіть дату";
      if (v.rangeUnderflow) return "Дата не може бути в минулому";
      break;
    case "time":
      if (v.valueMissing) return "Будь ласка, виберіть час";
      break;
    case "hours":
      if (v.valueMissing) return "Будь ласка, введіть кількість годин";
      if (v.rangeUnderflow) return "Мінімум 1 година";
      if (v.rangeOverflow) return "Максимум 12 годин";
      break;
  }
  return "Некоректне значення";
}

function showError(input) {
  const errorEl = document.querySelector(`[data-error-for="${input.id}"]`);
  if (!errorEl) return;
  const message = getErrorMessage(input);
  errorEl.textContent = message;
  input.classList.toggle("invalid", !!message);
}

const inputs = [nameInput, tel, dateInput, timeInput, hoursInput];

inputs.forEach((input) => {
  const eventName = input.tagName === "SELECT" ? "change" : "input";
  input.addEventListener(eventName, () => showError(input));
  input.addEventListener("blur", () => showError(input));
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let firstInvalid = null;
  inputs.forEach((input) => {
    showError(input);
    if (!input.validity.valid && !firstInvalid) firstInvalid = input;
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const formData = new FormData(form);
  let outputText = "Збережені дані:\n";
  for (const [key, value] of formData.entries()) {
    outputText += `${key}: ${value}\n`;
  }
  const formHeader = document.getElementById("formTitle");
  const formText = document.getElementById("formText");
  formHeader.textContent = "Дякуємо за бронювання!";
  formText.textContent = "Наш менеджер зв'яжеться з вами найближчим часом:\n" + outputText;

  const afterSubmit = document.querySelector(".text-after-submit");
  if (afterSubmit) afterSubmit.removeAttribute("hidden");
  form.reset();
});

}

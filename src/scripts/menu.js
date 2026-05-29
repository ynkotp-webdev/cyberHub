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
if (form) {
  const nameInput = document.getElementById("name");
  const tel = document.getElementById("tel");
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const hoursInput = document.getElementById("hours");

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
        if (v.tooShort || v.patternMismatch) return "Ім'я має містити мінімум 2 символи";
        break;
      case "tel":
        if (v.valueMissing) return "Будь ласка, введіть номер телефону";
        if (v.patternMismatch) return "Введіть номер у форматі +380XXXXXXXXX";
        if (v.tooShort) return "Введіть номер у форматі +380XXXXXXXXX";
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
    if (errorEl) errorEl.textContent = getErrorMessage(input);
    input.classList.toggle("invalid", !input.validity.valid);
  }

  const inputs = [nameInput, tel, dateInput, timeInput, hoursInput];

  inputs.forEach((input) => {
    const eventName = input.tagName === "SELECT" ? "change" : "input";
    input.addEventListener(eventName, () => showError(input));
    input.addEventListener("blur", () => showError(input));
    input.addEventListener("invalid", (event) => {
      event.preventDefault();
      showError(input);
    });
  });

  function clearAllErrors() {
    inputs.forEach((input) => {
      input.classList.remove("invalid");
      const errorEl = document.querySelector(`[data-error-for="${input.id}"]`);
      if (errorEl) errorEl.textContent = "";
    });
  }

  const formHeader = document.getElementById("formTitle");
  const formText = document.getElementById("formText");
  const submitBtn = form.querySelector("button[type='submit']");

  const initialHeader = formHeader.textContent;
  const initialText = formText.textContent;

  function buildSummary(formData) {
    const lines = [];
    for (const [key, value] of formData.entries()) {
      lines.push(`${key}: ${value}`);
    }
    return lines.join("\n");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    formHeader.textContent = initialHeader;
    formText.textContent = initialText;

    if (!form.checkValidity()) {
      form.reportValidity();
      const firstInvalid = inputs.find((input) => !input.validity.valid);
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const formData = new FormData(form);
    const summary = buildSummary(formData);

    submitBtn.disabled = true;
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Відправляємо...";

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        formHeader.textContent = "Дякуємо за бронювання!";
        formText.textContent =
          "Наш менеджер зв'яжеться з вами найближчим часом.\n\nВаші дані:\n" + summary;
        form.reset();
        clearAllErrors();
      } else {
        const result = await response.json().catch(() => null);
        const message = result?.errors?.[0]?.message;
        formHeader.textContent = "Не вдалося відправити форму";
        formText.textContent = message
          ? `Помилка: ${message}. Спробуйте ще раз.`
          : "Щось пішло не так. Будь ласка, спробуйте ще раз.";
      }
    } catch (err) {
      formHeader.textContent = "Помилка мережі";
      formText.textContent = "Перевірте інтернет-з'єднання та спробуйте ще раз.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}

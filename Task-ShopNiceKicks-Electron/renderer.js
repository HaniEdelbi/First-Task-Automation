const { ipcRenderer } = require("electron");

let isAutomationRunning = false;

const form = document.getElementById("automationForm");
const startBtn = document.getElementById("startBtn");
const buttonText = document.getElementById("buttonText");
const loadingSpinner = document.getElementById("loadingSpinner");
const logArea = document.getElementById("logArea");
const statusIndicator = document.getElementById("statusIndicator");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (isAutomationRunning) {
    return;
  }

  const formData = {
    url: document.getElementById("url").value,
    size: document.getElementById("size").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    country: document.getElementById("country").value,
    state: document.getElementById("state").value,
    address: document.getElementById("address").value,
    apartment: document.getElementById("apartment").value,
    city: document.getElementById("city").value,
    zip: document.getElementById("zip").value,
    credit: document.getElementById("credit").value,
    expiry: document.getElementById("expiry").value,
    code: document.getElementById("code").value,
    cardName: document.getElementById("cardName").value,
  };

  const requiredFields = [
    "url",
    "size",
    "email",
    "phone",
    "firstName",
    "lastName",
    "country",
    "state",
    "address",
    "city",
    "zip",
    "credit",
    "expiry",
    "code",
    "cardName",
  ];

  const missingFields = requiredFields.filter(
    (field) => !formData[field].trim()
  );

  if (missingFields.length > 0) {
    addLogEntry(
      "error",
      `Missing required fields: ${missingFields.join(", ")}`
    );
    return;
  }

  setAutomationState(true);
  addLogEntry("info", "Starting automation with provided data...");

  try {
    const result = await ipcRenderer.invoke("start-automation", formData);

    if (result.success) {
      addLogEntry("success", result.message);
    } else {
      addLogEntry("error", result.message);
    }
  } catch (error) {
    addLogEntry("error", `Failed to start automation: ${error.message}`);
  } finally {
    setAutomationState(false);
  }
});

ipcRenderer.on("log-message", (event, logData) => {
  addLogEntry(logData.type, logData.message, logData.timestamp);
});

function setAutomationState(running) {
  isAutomationRunning = running;

  if (running) {
    startBtn.disabled = true;
    buttonText.textContent = "Running Automation...";
    loadingSpinner.style.display = "inline-block";
    statusIndicator.style.background = "#ffc107";
  } else {
    startBtn.disabled = false;
    buttonText.textContent = "Start Automation";
    loadingSpinner.style.display = "none";
    statusIndicator.style.background = "#28a745";
  }
}

function addLogEntry(type, message, timestamp = null) {
  const logEntry = document.createElement("div");
  logEntry.className = "log-entry";

  const time = timestamp
    ? new Date(timestamp).toLocaleTimeString()
    : new Date().toLocaleTimeString();

  logEntry.innerHTML = `
        <span class="log-timestamp">[${time}]</span>
        <span class="log-type-${type}">${message}</span>
    `;

  logArea.appendChild(logEntry);
  logArea.scrollTop = logArea.scrollHeight;
}

function clearLogs() {
  logArea.innerHTML = `
        <div class="log-entry">
            <span class="log-timestamp">[Ready]</span>
            <span class="log-type-info">Logs cleared. System ready.</span>
        </div>
    `;
}

function clearForm() {
  if (isAutomationRunning) {
    addLogEntry("warning", "Cannot clear form while automation is running.");
    return;
  }

  form.reset();
  addLogEntry("info", "Form data cleared.");
}

document.getElementById("credit").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
  let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
  e.target.value = formattedValue;
});

document.getElementById("expiry").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length >= 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 4);
  }
  e.target.value = value;
});

document.getElementById("phone").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  e.target.value = value;
});

document.addEventListener("DOMContentLoaded", function () {
  addLogEntry("info", "Application loaded successfully.");
  addLogEntry(
    "info",
    'Fill out the form and click "Start Automation" to begin.'
  );

  document.getElementById("url").focus();
});

window.clearLogs = clearLogs;
window.clearForm = clearForm;

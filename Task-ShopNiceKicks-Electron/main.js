const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("path");
const puppeteer = require("puppeteer");
const { addToCart } = require("./utils/addToCart");
const { delay } = require("./utils/delay");
const { navigatePage } = require("./utils/navigatePage");
const { selectSize } = require("./utils/selectSize");
const { checkout } = require("./utils/checkOut");
const { Details } = require("./utils/checkoutDetails");
const { CreditCard } = require("./utils/CreditCard");
const { Checked } = require("./utils/Checkbox");
const { PayNow } = require("./utils/PayNow");
const { RememberMe } = require("./utils/rememberMe");
const logger = require("./config/logger");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");

  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
};

ipcMain.handle("start-automation", async (event, formData) => {
  let browser;

  try {
    mainWindow.webContents.send("log-message", {
      type: "info",
      message: "Starting automation process...",
      timestamp: new Date().toISOString(),
    });

    logger.info("Starting Puppeteer browser");
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(60000);
    await page.setViewport({ width: 1080, height: 1024 });

    mainWindow.webContents.send("log-message", {
      type: "info",
      message: "Browser launched successfully",
      timestamp: new Date().toISOString(),
    });

    // Navigate to page
    mainWindow.webContents.send("log-message", {
      type: "info",
      message: `Navigating to: ${formData.url}`,
      timestamp: new Date().toISOString(),
    });

    await navigatePage(page, formData.url);

    // Select size
    mainWindow.webContents.send("log-message", {
      type: "info",
      message: `Selecting size: ${formData.size}`,
      timestamp: new Date().toISOString(),
    });

    await selectSize(page, formData.size);

    // Add to cart
    mainWindow.webContents.send("log-message", {
      type: "info",
      message: "Adding item to cart...",
      timestamp: new Date().toISOString(),
    });

    await addToCart(page);

    // Checkout
    mainWindow.webContents.send("log-message", {
      type: "info",
      message: "Proceeding to checkout...",
      timestamp: new Date().toISOString(),
    });

    await checkout(page);

    // Fill details
    mainWindow.webContents.send("log-message", {
      type: "info",
      message: "Filling checkout details...",
      timestamp: new Date().toISOString(),
    });

    await Details(page, {
      email: formData.email,
      country: formData.country,
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Address: formData.address,
      Apartment: formData.apartment,
      city: formData.city,
      state: formData.state,
      Zip: formData.zip,
      Phone: formData.phone,
    });

    // Fill credit card
    mainWindow.webContents.send("log-message", {
      type: "info",
      message: "Filling credit card information...",
      timestamp: new Date().toISOString(),
    });

    await CreditCard(page, {
      Credit: formData.credit,
      Exp: formData.expiry,
      code: formData.code,
      Name: formData.cardName,
    });

    // Handle checkboxes and payment
    mainWindow.webContents.send("log-message", {
      type: "info",
      message: "Processing final steps...",
      timestamp: new Date().toISOString(),
    });

    await Checked(page);
    await RememberMe(page);
    await PayNow(page);

   

    return { success: true, message: "Automation completed successfully!" };
  } catch (error) {
    logger.error("Automation failed:", error);

    mainWindow.webContents.send("log-message", {
      type: "error",
      message: `Error: ${error.message}`,
      timestamp: new Date().toISOString(),
    });

    return { success: false, message: error.message };
  } finally {
    if (browser) {
      await browser.close();
      mainWindow.webContents.send("log-message", {
        type: "info",
        message: "Browser closed",
        timestamp: new Date().toISOString(),
      });
    }
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

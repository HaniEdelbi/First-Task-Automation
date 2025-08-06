const logger = require("../config/logger");
const { withRetry } = require("./retry");

async function setFormLocalStorage(page) {
  await withRetry(async () => {
    logger.info("Setting form localStorage to prevent popups...");
    const timestamp = Math.floor(Date.now() / 1000);

    const formData = {
      viewedForms: {
        modal: {
          disabledForms: {
            WwnnJP: {
              lastCloseTime: timestamp,
            },
          },
          viewedForms: {
            Y2TtFr: timestamp - 7000,
            UAgGyp: timestamp - 6000,
            WmUPzD: timestamp - 5000,
            SkbCsD: timestamp - 4000,
            V2brKh: timestamp - 3000,
            WwnnJP: timestamp - 2000,
            RCkcpr: timestamp - 1000,
            R6Eacx: timestamp,
          },
          disabledTeasers: {},
        },
      },
    };

    await page.evaluate((data) => {
      localStorage.setItem("viewedForms", JSON.stringify(data));
    }, formData);

    logger.info("Form localStorage successfully set");
  });
}

module.exports = { setFormLocalStorage };

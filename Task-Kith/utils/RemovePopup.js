const logger = require("../config/logger");
const { withRetry } = require("./retry");

async function RemovePopup(page) {
  await withRetry(async () => {
    await page.waitForSelector("button[js-close-welcome-mat]", {
      visible: true,
    });
    await page.click("button[js-close-welcome-mat]");
    logger.info("Shop kith.com button clicked.");
  });
}
module.exports = { RemovePopup };

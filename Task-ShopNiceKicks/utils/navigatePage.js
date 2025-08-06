const logger = require("../config/logger");
const { withRetry } = require("./retry");

async function navigatePage(page, URL) {
  await withRetry(async () => {
    logger.info(`Navigating to: ${URL}`);
    await page.goto(URL, { waitUntil: "networkidle2" });
    logger.info("Page loaded successfully!");
  });
}

module.exports = { navigatePage };

const logger = require("../config/logger");
const { withRetry } = require("./retry");

async function checkout(page) {
  await withRetry(async () => {
    await page.waitForSelector(
      ".Cart__Checkout.Button.Button--primary.Button--full"
    );
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }),
      page.click(".Cart__Checkout.Button.Button--primary.Button--full"),
    ]);
    logger.info("Checkout button clicked!");
  });
}

module.exports = { checkout };

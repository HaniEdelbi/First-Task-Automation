const logger = require("../config/logger");
const { withRetry } = require("./retry");

async function checkout(page) {
  await withRetry(async () => {
    await page.waitForSelector("#CartDrawer-Checkout", { visible: true });

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }),
      page.click("#CartDrawer-Checkout"),
    ]);

    logger.info("Checkout button clicked!");
  });
}

module.exports = { checkout };

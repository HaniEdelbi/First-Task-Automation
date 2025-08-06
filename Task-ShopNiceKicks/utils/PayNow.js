const logger = require("../config/logger");
const { withRetry } = require("./retry");

async function PayNow(page) {
  await withRetry(async () => {
    await page.waitForSelector("#checkout-pay-button", { visible: true });
    await page.click("#checkout-pay-button");
    logger.info("Pay Now Clicked");
  });
}
module.exports = { PayNow };

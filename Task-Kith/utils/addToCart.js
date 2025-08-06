const logger = require("../config/logger");
const { withRetry } = require("./retry");
const { delay } = require("./delay");

async function addToCart(page) {
  await withRetry(async () => {
    await page.waitForSelector("button[js-add-to-cart]", { visible: true });

    await page.click("button[js-add-to-cart]");
    logger.info("Add to cart button clicked!");

    await delay(1000);
    logger.info("Waiting after clicking Add to Cart...");
  });
}

module.exports = { addToCart };

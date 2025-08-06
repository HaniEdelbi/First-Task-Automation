const logger = require("../config/logger");
const { withRetry } = require("./retry");

async function addToCart(page) {
  await withRetry(async () => {
    await page.waitForSelector(
      ".ProductForm__AddToCart.Button--primary.Button--full"
    );
    await page.click(".ProductForm__AddToCart.Button--primary.Button--full");
    logger.info("Add to cart button clicked!");
    await page.waitForSelector("#sidebar-cart", { visible: true });
    logger.info("Cart page loaded!");
  });
}

module.exports = { addToCart };

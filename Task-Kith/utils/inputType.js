const logger = require("../config/logger");
const { withRetry } = require("./retry");
const { delay } = require("./delay");

async function inputType(page, selector, value) {
  await withRetry(async () => {
    logger.info(`Filling input field ${selector} with value: ${value}`);
    await page.focus(selector);
    await page.evaluate((sel) => {
      document.querySelector(sel).value = "";
    }, selector);
    await page.type(selector, value, { delay: 100 });
    await delay(100);
    logger.info(`Successfully filled ${selector}`);
  });
}
module.exports = { inputType };

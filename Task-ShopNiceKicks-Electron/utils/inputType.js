const logger = require("../config/logger");
const { delay } = require("./delay");
const { withRetry } = require("./retry");

async function inputType(page, selector, value) {
  await withRetry(async () => {
    logger.info(`Typing "${value}" into ${selector}`);
    await page.focus(selector);
    await page.evaluate((sel) => {
      document.querySelector(sel).value = "";
    }, selector);
    await page.type(selector, value, { delay: 100 });
    await delay(100);
  });
}
module.exports = { inputType };

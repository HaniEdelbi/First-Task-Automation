const logger = require("../config/logger");
const { withRetry } = require("./retry");

async function RememberMe(page) {
  await withRetry(async () => {
    const isChecked = await page.$eval(
      "#RememberMe-RememberMeCheckbox",
      (el) => el.checked
    );

    if (isChecked) {
      await page.click("#RememberMe-RememberMeCheckbox");
      logger.info("Box Unchecked");
    } else {
      logger.info("Already Unchecked");
    }
  });
}
module.exports = { RememberMe };

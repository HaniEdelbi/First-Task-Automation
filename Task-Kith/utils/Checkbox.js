const logger = require("../config/logger");
const { withRetry } = require("./retry");

async function Checked(page) {
  await withRetry(async () => {
    const isChecked = await page.$eval(
      "#DeprecatedCheckbox0",
      (el) => el.checked
    );

    if (!isChecked) {
      await page.click("#DeprecatedCheckbox0");
      logger.info("Checkbox is now checked.");
    } else {
      logger.info("Checkbox was already checked.");
    }
  });
}
module.exports = { Checked };

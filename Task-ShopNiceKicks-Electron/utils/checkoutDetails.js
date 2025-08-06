const { inputType } = require("./inputType");
const logger = require("../config/logger");
const { withRetry } = require("./retry");

async function Details(page, info) {
  await withRetry(async () => {
    logger.info("Filling checkout details...");
    await inputType(page, "#email", info.email);
    await page.select('select[name="countryCode"]', info.country);
    await inputType(page, 'input[name="firstName"]', info.FirstName);
    await inputType(page, 'input[name="lastName"]', info.LastName);
    await inputType(page, 'input[name="address1"]', info.Address);
    await inputType(page, 'input[name="address2"]', info.Apartment);
    await inputType(page, 'input[name="city"]', info.city);
    await page.select('select[name="zone"]', info.state);
    await inputType(page, 'input[name="postalCode"]', info.Zip);
    await inputType(page, 'input[name="phone"]', info.Phone);
    logger.info("Checkout details filled successfully!");
  });
}
module.exports = { Details };

const puppeteer = require("puppeteer");
const logger = require("./config/logger");
const { addToCart } = require("./utils/addToCart");
const { delay } = require("./utils/delay");
const { navigatePage } = require("./utils/navigatePage");
const { selectSize } = require("./utils/selectSize");
const { checkout } = require("./utils/checkOut");
const { Details } = require("./utils/checkoutDetails");
const { CreditCard } = require("./utils/CreditCard");
const { Checked } = require("./utils/Checkbox");
const { PayNow } = require("./utils/PayNow");
const { RememberMe } = require("./utils/rememberMe");

async function run() {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(60000);
    await page.setViewport({ width: 1080, height: 1024 });

    const URL =
      "https://shopnicekicks.com/products/jordan-ct8532-111-air-jordan-3-retro-white-and-silver-mens-lifestyle-shoe-white-metallic-silver";

    await navigatePage(page, URL);
    await selectSize(page, "M14 / W15.5");
    await addToCart(page);
    await checkout(page);
    await Details(page, {
      email: "randomaddress@gmail.com",
      country: "United States",
      FirstName: "Caroline",
      LastName: "Bieber",
      Address: "SteakHouse",
      Apartment: "Beaverton",
      city: "Ohio",
      state: "OR",
      Zip: "97005",
      Phone: "18358778281",
    });
    await CreditCard(page, {
      Credit: "5222131812434359",
      Exp: "03/26",
      code: "319",
      Name: "Forest Herzog",
    });
    await Checked(page);
    await RememberMe(page);
    await PayNow(page);
  } catch (error) {
    logger.error(error);
  } finally {
    await browser.close();
    process.exit(0);
  }
}
run();

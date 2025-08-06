const logger = require("../config/logger");
const { withRetry } = require("./retry");

async function CreditCard(page, info) {
  await withRetry(async () => {
    logger.info("Filling credit card info...");
    await page.waitForSelector(".card-fields-iframe", { visible: true });

    const frameHandles = await page.$$(".card-fields-iframe");

    const inputValues = [
      { selector: 'input[name="number"]', value: info.Credit },
      { selector: 'input[name="expiry"]', value: info.Exp },
      { selector: 'input[name="verification_value"]', value: info.code },
      { selector: 'input[name="name"]', value: info.Name },
    ];

    let inputIndex = 0;

    for (let i = 0; i < frameHandles.length; i++) {
      const frameHandle = frameHandles[i];
      const frame = await frameHandle.contentFrame();

      const isHidden = await frameHandle.evaluate(
        (node) => node.closest("[hidden]") !== null
      );
      if (isHidden) {
        continue;
      }

      const field = inputValues[inputIndex];
      await frame.waitForSelector(field.selector, { visible: true });

      if (field.selector === 'input[name="name"]') {
        const inputElem = await frame.$(field.selector);
        await inputElem.click({ clickCount: 3 });
        await inputElem.press("Backspace");
      }

      await frame.type(field.selector, field.value, { delay: 100 });
      logger.info(`${field.selector} filled with ${field.value}`);

      inputIndex++;
    }
  });
}

module.exports = { CreditCard };

const logger = require("../config/logger");
const { withRetry } = require("./retry");

async function getSizes(page) {
  return await withRetry(async () => {
    logger.info("Getting available sizes...");
    await page.waitForSelector("product-options .product-option__swatch", {
      visible: true,
    });

    const sizes = await page.evaluate(() => {
      const wrappers = document.querySelectorAll(
        "product-options .product-option__swatch .grid .relative"
      );

      return Array.from(wrappers)
        .map((wrapper) => {
          const input = wrapper.querySelector("input.product-swatch__input");
          const label = wrapper.querySelector("label.product-swatch__label");

          const sizeLabel = label?.textContent.trim();
          const isAvailable = !input?.disabled;

          return {
            sizeLabel,
            isAvailable,
            value: input?.value,
            id: input?.id,
          };
        })
        .filter((s) => s.value);
    });

    logger.info(`Found ${sizes.length} sizes`);
    return sizes;
  });
}

module.exports = { getSizes };

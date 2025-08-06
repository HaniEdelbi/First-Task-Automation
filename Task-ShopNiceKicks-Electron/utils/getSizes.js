const logger = require("../config/logger");
const { withRetry } = require("./retry");

async function getSizes(page) {
  return await withRetry(async () => {
    logger.info("Getting available sizes...");
    await page.waitForSelector(".SizeSwatchList", { visible: true });

    const sizes = await page.evaluate(() => {
      const sizeItems = document.querySelectorAll(
        ".SizeSwatchList .HorizontalList__Item"
      );
      return Array.from(sizeItems).map((item) => {
        const input = item.querySelector("input.SizeSwatch__Radio");
        const label = item.querySelector("label.SizeSwatch");

        const sizeLabel = label?.textContent.trim();
        const isAvailable = !label?.classList.contains("gb-change-color");

        return {
          sizeLabel,
          isAvailable,
          value: input?.value,
          id: input?.id,
        };
      });
    });

    logger.info(`Found ${sizes.length} sizes`);
    return sizes;
  });
}

module.exports = { getSizes };

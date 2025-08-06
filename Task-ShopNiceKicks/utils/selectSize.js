const { getSizes } = require("./getSizes");
const logger = require("../config/logger");
const { withRetry } = require("./retry");

async function selectSize(page, desiredSizeLabel) {
  await withRetry(async () => {
    const sizes = await getSizes(page);
    logger.info(
      `Available sizes: ${sizes
        .map(
          (s) =>
            `${s.sizeLabel} (${s.isAvailable ? "In Stock" : "Out of Stock"})`
        )
        .join(", ")}`
    );

    const targetSize = sizes.find((s) => s.sizeLabel === desiredSizeLabel);

    if (!targetSize) {
      throw new Error(`Size "${desiredSizeLabel}" not found on the page.`);
    }

    if (!targetSize.isAvailable) {
      throw new Error(`Size "${desiredSizeLabel}" is out of stock.`);
    }

    logger.info(`Selecting size: ${desiredSizeLabel}`);
    await page.click(`label[for="${targetSize.id}"]`);
    logger.info("Size selected successfully!");
  });
}

module.exports = { selectSize };

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

    let targetSize = sizes.find((s) => s.sizeLabel === desiredSizeLabel);

    if (!targetSize) {
      targetSize = sizes.find(
        (s) =>
          s.sizeLabel.toLowerCase().includes(desiredSizeLabel.toLowerCase()) ||
          desiredSizeLabel.toLowerCase().includes(s.sizeLabel.toLowerCase())
      );
    }

    if (!targetSize) {
      throw new Error(
        `Size "${desiredSizeLabel}" not found on the page. Available sizes: ${sizes
          .map((s) => s.sizeLabel)
          .join(", ")}`
      );
    }

    if (!targetSize.isAvailable) {
      throw new Error(`Size "${desiredSizeLabel}" is out of stock.`);
    }

    logger.info(
      `Selecting size: ${targetSize.sizeLabel} (ID: ${targetSize.id})`
    );

    try {
      await page.click(`label[for="${targetSize.id}"]`);
    } catch (error) {
      logger.info("Label click failed, trying input click...");
      await page.click(`#${targetSize.id}`);
    }

    const isSelected = await page.evaluate((id) => {
      const input = document.getElementById(id);
      return input ? input.checked : false;
    }, targetSize.id);

    if (isSelected) {
      logger.info("Size selected successfully!");
    } else {
      throw new Error("Size selection failed - input not checked");
    }
  });
}

module.exports = { selectSize };

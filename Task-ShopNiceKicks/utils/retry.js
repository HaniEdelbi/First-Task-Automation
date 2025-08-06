const logger = require("../config/logger");
const { delay } = require("./delay");

async function withRetry(operation, maxRetries = 3, retryDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      logger.warn(`Attempt ${attempt} failed: ${error.message}`);

      if (attempt === maxRetries) {
        logger.error(
          `All ${maxRetries} attempts failed. Final error: ${error.message}`
        );
        throw error;
      }

      logger.info(`Retrying in ${retryDelay}ms... (${attempt}/${maxRetries})`);
      await delay(retryDelay);
    }
  }
}

module.exports = { withRetry };

const crypto = require("node:crypto");

function createOrderAccessToken(orderCode) {
  const secret = process.env.ORDER_ACCESS_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("ORDER_ACCESS_SECRET is not configured");
  }

  return crypto.createHmac("sha256", secret).update(orderCode).digest("hex");
}

function verifyOrderAccessToken(orderCode, token) {
  if (
    typeof orderCode !== "string" ||
    typeof token !== "string" ||
    !/^[a-f0-9]{64}$/i.test(token)
  ) {
    return false;
  }

  const expected = Buffer.from(createOrderAccessToken(orderCode), "hex");

  const received = Buffer.from(token, "hex");

  return crypto.timingSafeEqual(expected, received);
}

module.exports = {
  createOrderAccessToken,
  verifyOrderAccessToken,
};

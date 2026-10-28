const { syncPaymentStatus } = require("../services/paymentStatusService");

const { verifyOrderAccessToken } = require("../lib/orderAccess");

async function verifyPayment(req, res) {
  const { orderCode } = req.params;

  const token = req.get("x-order-access-token");

  if (!verifyOrderAccessToken(orderCode, token)) {
    return res.status(403).json({
      success: false,
      message: "Invalid order access token",
    });
  }

  try {
    const result = await syncPaymentStatus(orderCode);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Payment verification error:", error.message);

    return res.status(error.statusCode || 502).json({
      success: false,
      message:
        error.statusCode === 404
          ? "Order not found"
          : "Unable to verify payment",
    });
  }
}

module.exports = { verifyPayment };

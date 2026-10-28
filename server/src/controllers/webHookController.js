
const crypto = require("node:crypto");

const {
  syncPaymentStatus,
} = require("../services/paymentStatusService");

// Verifikasi signature SHA-512 dari Midtrans
function verifySignature(notification) {
  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
  } = notification;

  const serverKey =
    process.env.MIDTRANS_SERVER_KEY?.trim();

  if (
    !serverKey ||
    [order_id, status_code, gross_amount, signature_key]
      .some((value) => typeof value !== "string")
  ) {
    return false;
  }

  // Signature Midtrans berupa 128 karakter hexadecimal
  if (!/^[a-f0-9]{128}$/i.test(signature_key)) {
    return false;
  }

  const signatureString =
    order_id + status_code + gross_amount + serverKey;

  const expected = crypto
    .createHash("sha512")
    .update(signatureString)
    .digest();

  const received = Buffer.from(signature_key, "hex");

  return crypto.timingSafeEqual(expected, received);
}

// POST /api/webhooks/midtrans
async function handleMidtransWebhook(req, res) {
  const notification = req.body;

  if (
    !notification ||
    typeof notification !== "object" ||
    Array.isArray(notification)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid notification body",
    });
  }

  // Jangan memproses notifikasi tanpa signature valid
  if (!verifySignature(notification)) {
    console.warn("Rejected invalid Midtrans signature");

    return res.status(401).json({
      success: false,
      message: "Invalid notification signature",
    });
  }

  try {
    const result = await syncPaymentStatus(
      notification.order_id
    );

    console.log("Midtrans webhook processed:", {
      orderCode: result.orderCode,
      paymentStatus: result.paymentStatus,
      midtransStatus: result.midtransStatus,
    });

    return res.status(200).json({
      success: true,
      message: "Notification processed",
    });
  } catch (error) {
    console.error(
      "Midtrans webhook error:",
      error.message
    );

    // HTTP 500 memungkinkan Midtrans mencoba
    // mengirim ulang notifikasi saat terjadi
    // kegagalan pemrosesan sementara.
    return res.status(500).json({
      success: false,
      message: "Notification processing failed",
    });
  }
}

module.exports = { handleMidtransWebhook };

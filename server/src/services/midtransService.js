const midtransClient = require("midtrans-client");
require("dotenv").config();

const serverKey = (process.env.MIDTRANS_SERVER_KEY || "").trim();

const clientKey = (process.env.MIDTRANS_CLIENT_KEY || "").trim();

// Diagnostic tanpa menampilkan credential
console.log("Midtrans Configuration Check:", {
  environment: "Sandbox",
  serverKeyConfigured: Boolean(serverKey),
  clientKeyConfigured: Boolean(clientKey),
  serverKeyLooksSandbox: serverKey.startsWith("SB-Mid-server-"),
  clientKeyLooksSandbox: clientKey.startsWith("SB-Mid-client-"),
});

if (!serverKey || !clientKey) {
  throw new Error("Midtrans credentials are missing");
}

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey,
  clientKey,
});

module.exports = snap;

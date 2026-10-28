const express = require("express");

const { handleMidtransWebhook } = require("../controllers/webHookController");

const router = express.Router();

router.post("/midtrans", handleMidtransWebhook);

module.exports = router;

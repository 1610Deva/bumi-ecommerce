
const express = require("express");
const {
  verifyPayment,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/:orderCode/verify-payment", verifyPayment);

module.exports = router;

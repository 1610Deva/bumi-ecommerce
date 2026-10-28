const { randomUUID } = require("node:crypto");

const prisma = require("../lib/prisma");
const snap = require("../services/midtransService");

const { createOrderAccessToken } = require("../lib/orderAccess");

const { releaseReservedOrder } = require("../services/paymentStatusService");

class CheckoutError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function createCheckout(req, res) {
  const { customerName, customerEmail, customerPhone, shippingAddress, items } =
    req.body || {};

  // ===================================
  // 1. VALIDASI CUSTOMER
  // ===================================

  const fields = [customerName, customerEmail, customerPhone, shippingAddress];

  if (
    fields.some(
      (value) => typeof value !== "string" || value.trim().length === 0,
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Customer information is required",
    });
  }

  const customer = {
    name: customerName.trim(),
    email: customerEmail.trim(),
    phone: customerPhone.trim(),
    address: shippingAddress.trim(),
  };

  if (
    customer.name.length > 100 ||
    customer.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
    customer.phone.length < 9 ||
    customer.phone.length > 20 ||
    customer.address.length < 10 ||
    customer.address.length > 500
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid customer information",
    });
  }

  // ===================================
  // 2. VALIDASI CART
  // ===================================

  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return res.status(400).json({
      success: false,
      message: "Invalid shopping cart",
    });
  }

  const validItems = items.every(
    (item) =>
      item &&
      typeof item.productId === "string" &&
      item.productId.length > 0 &&
      Number.isInteger(item.quantity) &&
      item.quantity >= 1 &&
      item.quantity <= 100,
  );

  const productIds = items.map((item) => item.productId);

  if (!validItems || new Set(productIds).size !== productIds.length) {
    return res.status(400).json({
      success: false,
      message: "Invalid cart items",
    });
  }

  let order;

  try {
    // ===================================
    // 3. DATABASE TRANSACTION
    // ===================================

    order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
          isActive: true,
        },
      });

      if (products.length !== productIds.length) {
        throw new CheckoutError("One or more products are unavailable", 409);
      }

      const productMap = new Map(
        products.map((product) => [product.id, product]),
      );

      const orderItems = items.map((item) => {
        const product = productMap.get(item.productId);

        if (
          !product ||
          !Number.isSafeInteger(product.price) ||
          product.price <= 0
        ) {
          throw new CheckoutError("Invalid product", 400);
        }

        const lineTotal = product.price * item.quantity;

        if (!Number.isSafeInteger(lineTotal)) {
          throw new CheckoutError("Invalid amount", 400);
        }

        return {
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
          subtotal: lineTotal,
        };
      });

      const subtotal = orderItems.reduce(
        (total, item) => total + item.subtotal,
        0,
      );

      const shippingCost = 0;
      const totalAmount = subtotal + shippingCost;

      if (!Number.isSafeInteger(totalAmount) || totalAmount <= 0) {
        throw new CheckoutError("Invalid total amount", 400);
      }

      // Urutan konsisten mengurangi potensi deadlock
      const sortedItems = [...orderItems].sort((a, b) =>
        a.productId.localeCompare(b.productId),
      );

      // Reservasi stok secara atomik
      for (const item of sortedItems) {
        const result = await tx.product.updateMany({
          where: {
            id: item.productId,
            isActive: true,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (result.count !== 1) {
          throw new CheckoutError(
            `Insufficient stock: ${item.productName}`,
            409,
          );
        }
      }

      // Order dibuat dalam transaksi yang sama
      return tx.order.create({
        data: {
          orderCode: `BUMI-${randomUUID()}`,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          shippingAddress: customer.address,
          subtotal,
          shippingCost,
          totalAmount,
          paymentStatus: "PENDING",
          inventoryStatus: "RESERVED",

          items: {
            create: orderItems,
          },
        },
      });
    });
  } catch (error) {
    console.error("Order creation error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error instanceof CheckoutError
          ? error.message
          : "Unable to create order",
    });
  }

  // ===================================
  // 4. CREATE MIDTRANS TRANSACTION
  // ===================================

  try {
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: order.id },
    });

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: order.orderCode,
        gross_amount: order.totalAmount,
      },

      item_details: orderItems.map((item) => ({
        id: item.productId,
        name: item.productName.slice(0, 50),
        price: item.unitPrice,
        quantity: item.quantity,
      })),

      customer_details: {
        first_name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Checkout session created",
      data: {
        orderCode: order.orderCode,
        redirectUrl: transaction.redirect_url,
        orderAccessToken: createOrderAccessToken(order.orderCode),
      },
    });
  } catch (error) {
    console.error("Midtrans checkout error:", error.message);

    // Hanya untuk penolakan yang jelas dari gateway.
    // Timeout atau error jaringan bersifat ambigu:
    // transaksi mungkin sudah tercipta di Midtrans.
    const code = Number(error.httpStatusCode);

    if ([400, 401, 403, 422].includes(code)) {
      try {
        await releaseReservedOrder(order.id);
      } catch (releaseError) {
        console.error(
          "Failed to release rejected order:",
          releaseError.message,
        );
      }
    }

    return res.status(502).json({
      success: false,
      message: "Unable to create payment session",
    });
  }
}

module.exports = { createCheckout };

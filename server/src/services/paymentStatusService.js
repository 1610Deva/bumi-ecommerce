
const prisma = require("../lib/prisma");
const snap = require("./midtransService");

// ====================================
// MAP STATUS MIDTRANS
// ====================================

function mapPaymentStatus(payment) {
  const status = payment.transaction_status;
  const fraud = payment.fraud_status?.toLowerCase();

  if (status === "settlement" || status === "capture") {
    if (
      String(payment.status_code) === "200" &&
      (!fraud || fraud === "accept")
    ) {
      return "PAID";
    }

    return "PENDING";
  }

  switch (status) {
    case "pending":
      return "PENDING";

    case "deny":
    case "failure":
      return "FAILED";

    case "expire":
      return "EXPIRED";

    case "cancel":
      return "CANCELLED";

    case "refund":
      return "REFUNDED";

    default:
      return null;
  }
}

// ====================================
// RELEASE RESERVATION
// Harus dipanggil dalam DB transaction
// ====================================

async function releaseInsideTransaction(
  tx,
  order,
  nextStatus
) {
  const changed = await tx.order.updateMany({
    where: {
      id: order.id,
      paymentStatus: "PENDING",
      inventoryStatus: "RESERVED",
    },
    data: {
      paymentStatus: nextStatus,
      inventoryStatus: "RELEASED",
    },
  });

  // Jika webhook duplikat, count = 0.
  // Stok tidak dikembalikan lagi.
  if (changed.count !== 1) {
    return false;
  }

  for (const item of order.items) {
    await tx.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          increment: item.quantity,
        },
      },
    });
  }

  return true;
}

// ====================================
// RELEASE SAAT SNAP DITOLAK
// ====================================

async function releaseReservedOrder(orderId) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return false;

    return releaseInsideTransaction(
      tx,
      order,
      "FAILED"
    );
  });
}

// ====================================
// UPDATE PAYMENT & INVENTORY
// ====================================

async function applyPaymentStatus(
  orderCode,
  nextStatus
) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { orderCode },
      include: { items: true },
    });

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      throw error;
    }

    // Abaikan status tidak dikenal / pending
    if (!nextStatus || nextStatus === "PENDING") {
      return;
    }

    // Order lama dibuat sebelum sistem reservasi
    if (order.inventoryStatus === "LEGACY") {
      if (order.paymentStatus === "PENDING") {
        await tx.order.updateMany({
          where: {
            id: order.id,
            paymentStatus: "PENDING",
          },
          data: {
            paymentStatus: nextStatus,
            ...(nextStatus === "PAID"
              ? { paidAt: new Date() }
              : {}),
          },
        });
      }

      // Tidak ada perubahan stok untuk legacy order
      return;
    }

    // ==================================
    // PAYMENT SUCCESS
    // ==================================

    if (nextStatus === "PAID") {
      if (order.inventoryStatus === "RELEASED") {
        throw new Error(
          "Paid order has released inventory. Manual reconciliation required."
        );
      }

      await tx.order.updateMany({
        where: {
          id: order.id,
          paymentStatus: "PENDING",
          inventoryStatus: "RESERVED",
        },
        data: {
          paymentStatus: "PAID",
          inventoryStatus: "COMMITTED",
          paidAt: new Date(),
        },
      });

      // Tidak decrement stok lagi!
      return;
    }

    // ==================================
    // FAILED / EXPIRED / CANCELLED
    // ==================================

    if (
      ["FAILED", "EXPIRED", "CANCELLED"].includes(
        nextStatus
      )
    ) {
      if (
        order.paymentStatus === "PAID" ||
        order.paymentStatus === "REFUNDED"
      ) {
        console.warn(
          "Payment reversal needs manual review:",
          orderCode,
          nextStatus
        );
        return;
      }

      await releaseInsideTransaction(
        tx,
        order,
        nextStatus
      );

      return;
    }

    // ==================================
    // REFUND
    // ==================================

    if (nextStatus === "REFUNDED") {
      await tx.order.updateMany({
        where: {
          id: order.id,
          paymentStatus: "PAID",
          inventoryStatus: "COMMITTED",
        },
        data: {
          paymentStatus: "REFUNDED",
        },
      });

      // Refund tidak otomatis menambah stok.
    }
  });
}

// ====================================
// MIDTRANS STATUS VERIFICATION
// ====================================

async function syncPaymentStatus(orderCode) {
  const order = await prisma.order.findUnique({
    where: { orderCode },
  });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  // Verifikasi langsung ke Midtrans
  const payment = await snap.transaction.status(
    orderCode
  );

  const validOrder =
    payment.order_id === order.orderCode;

  const amount = Number(payment.gross_amount);

  const validAmount =
    Number.isSafeInteger(amount) &&
    amount === order.totalAmount;

  if (!validOrder || !validAmount) {
    const error = new Error(
      "Midtrans transaction verification mismatch"
    );
    error.statusCode = 400;
    throw error;
  }

  const nextStatus = mapPaymentStatus(payment);

  if (!nextStatus) {
    console.warn(
      "Unsupported Midtrans status:",
      payment.transaction_status
    );
  }

  await applyPaymentStatus(
    orderCode,
    nextStatus
  );

  const updated = await prisma.order.findUnique({
    where: { orderCode },
    select: {
      orderCode: true,
      paymentStatus: true,
      inventoryStatus: true,
      totalAmount: true,
      paidAt: true,
    },
  });

  return {
    ...updated,
    midtransStatus: payment.transaction_status,
  };
}

module.exports = {
  syncPaymentStatus,
  releaseReservedOrder,
};

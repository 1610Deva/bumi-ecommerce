const express = require("express");
const cors = require("cors");
require("dotenv").config();

const prisma = require("./src/lib/prisma");

const productRoutes = require("./src/routes/productRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const checkoutRoutes = require("./src/routes/checkoutRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const webhookRoutes = require("./src/routes/webHookRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/webhooks", webhookRoutes);

// Health check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "BUMI API is running!"
  });
});

// Test koneksi PostgreSQL
app.get("/api/db-test", async (req, res) => {
  try {
    const totalProducts = await prisma.product.count();

    res.json({
      status: "success",
      message: "Database connected successfully!",
      totalProducts
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to connect to database"
    });
  }
});

app.listen(PORT, () => {
  console.log(`BUMI API running at http://localhost:${PORT}`);
});

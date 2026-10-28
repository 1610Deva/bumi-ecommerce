
const prisma = require("../lib/prisma");

// =====================================
// GET /api/products
// =====================================
const getAllProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    if (
      [category, search, sort].some(
        (value) => value !== undefined && typeof value !== "string"
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
      });
    }

    const where = {
      isActive: true,
    };

    // Filter berdasarkan kategori
    if (category) {
      where.category = {
        is: {
          slug: category.trim(),
        },
      };
    }

    // Pencarian berdasarkan nama produk
    if (search && search.trim()) {
      if (search.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Search query too long",
        });
      }

      where.name = {
        contains: search.trim(),
        mode: "insensitive",
      };
    }

    // Pilihan sorting
    const sortOptions = {
      newest: { createdAt: "desc" },
      price_asc: { price: "asc" },
      price_desc: { price: "desc" },
      name: { name: "asc" },
    };

    const orderBy = sortOptions[sort] || sortOptions.name;

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy,
    });

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      total: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
    });
  }
};

// =====================================
// GET /api/products/:slug
// =====================================
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        slug,
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    console.error("Get product detail error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve product",
    });
  }
};

module.exports = {
  getAllProducts,
  getProductBySlug,
};

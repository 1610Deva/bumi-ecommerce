const prisma = require('../src/lib/prisma')

// ===================================
// 1. KATEGORI PRODUK
// ===================================

const categories = [
  { name: "Drinkware", slug: "drinkware" },
  { name: "Kitchen & Dining", slug: "kitchen-dining" },
  { name: "Personal Care", slug: "personal-care" },
  { name: "Home Essentials", slug: "home-essentials" },
  { name: "Everyday Carry", slug: "everyday-carry" },
];

// ===================================
// 2. DATA 20 PRODUK BUMI
// ===================================

// Format:
// [kategori, nama, slug, harga, deskripsi, sustainabilityInfo]

const products = [
  // DRINKWARE
  [
    "drinkware",
    "Stainless Tumbler",
    "stainless-tumbler",
    129000,
    "Tumbler stainless steel untuk kebutuhan minum sehari-hari.",
    "Dapat digunakan berulang kali sebagai alternatif botol sekali pakai."
  ],
  [
    "drinkware",
    "Glass Water Bottle",
    "glass-water-bottle",
    89000,
    "Botol minum kaca dengan desain minimalis.",
    "Botol dapat digunakan kembali dan dirawat untuk pemakaian jangka panjang."
  ],
  [
    "drinkware",
    "Reusable Coffee Cup",
    "reusable-coffee-cup",
    99000,
    "Gelas kopi portabel untuk aktivitas harian.",
    "Alternatif gelas minuman sekali pakai ketika digunakan berulang kali."
  ],
  [
    "drinkware",
    "Stainless Straw Set",
    "stainless-straw-set",
    39000,
    "Set sedotan stainless steel dengan sikat pembersih.",
    "Dapat dicuci dan dipakai kembali sebagai alternatif sedotan sekali pakai."
  ],

  // KITCHEN & DINING
  [
    "kitchen-dining",
    "Reusable Lunch Box",
    "reusable-lunch-box",
    119000,
    "Kotak makan praktis untuk membawa bekal.",
    "Mendukung penggunaan wadah makanan secara berulang."
  ],
  [
    "kitchen-dining",
    "Bamboo Cutlery Set",
    "bamboo-cutlery-set",
    49000,
    "Set peralatan makan bambu untuk dibawa bepergian.",
    "Dapat menggantikan peralatan makan sekali pakai jika dirawat dengan baik."
  ],
  [
    "kitchen-dining",
    "Beeswax Food Wrap",
    "beeswax-food-wrap",
    59000,
    "Pembungkus makanan berbahan kain berlapis beeswax.",
    "Dapat digunakan ulang untuk membungkus makanan yang sesuai."
  ],
  [
    "kitchen-dining",
    "Reusable Food Storage Bag",
    "reusable-food-storage-bag",
    69000,
    "Kantong penyimpanan makanan yang dapat dicuci.",
    "Mengurangi kebutuhan kantong penyimpanan sekali pakai."
  ],

  // PERSONAL CARE
  [
    "personal-care",
    "Bamboo Toothbrush",
    "bamboo-toothbrush",
    25000,
    "Sikat gigi dengan gagang berbahan bambu.",
    "Menggunakan bahan bambu pada gagang; tetap memerlukan penggantian berkala."
  ],
  [
    "personal-care",
    "Shampoo Bar",
    "shampoo-bar",
    65000,
    "Sampo padat praktis untuk perawatan rambut.",
    "Berpotensi mengurangi kebutuhan kemasan botol jika dijual dengan kemasan minimal."
  ],
  [
    "personal-care",
    "Refillable Deodorant",
    "refillable-deodorant",
    79000,
    "Deodoran dengan wadah yang dapat diisi ulang.",
    "Mendukung penggunaan ulang wadah melalui pembelian isi ulang."
  ],
  [
    "personal-care",
    "Reusable Cotton Pads",
    "reusable-cotton-pads",
    45000,
    "Kapas pembersih wajah berbahan kain yang dapat dicuci.",
    "Alternatif kapas sekali pakai untuk penggunaan berulang."
  ],

  // HOME ESSENTIALS
  [
    "home-essentials",
    "Refillable Soap Dispenser",
    "refillable-soap-dispenser",
    55000,
    "Botol dispenser sabun untuk kebutuhan rumah.",
    "Wadah dapat digunakan kembali dengan produk sabun isi ulang."
  ],
  [
    "home-essentials",
    "Reusable Cleaning Cloth",
    "reusable-cleaning-cloth",
    35000,
    "Kain pembersih serbaguna untuk rumah.",
    "Dapat dicuci dan digunakan berulang kali."
  ],
  [
    "home-essentials",
    "Compost Bin",
    "compost-bin",
    189000,
    "Wadah pengomposan untuk sampah organik rumah tangga.",
    "Mendukung pengolahan sampah organik jika digunakan dengan benar."
  ],
  [
    "home-essentials",
    "Recycled Storage Basket",
    "recycled-storage-basket",
    99000,
    "Keranjang penyimpanan dari material daur ulang.",
    "Memanfaatkan material daur ulang dan dirancang untuk pemakaian berulang."
  ],

  // EVERYDAY CARRY
  [
    "everyday-carry",
    "Canvas Tote Bag",
    "canvas-tote-bag",
    79000,
    "Tas kanvas untuk aktivitas sehari-hari.",
    "Alternatif kantong belanja sekali pakai jika digunakan berkali-kali."
  ],
  [
    "everyday-carry",
    "Recycled Fabric Pouch",
    "recycled-fabric-pouch",
    59000,
    "Pouch serbaguna dari kain daur ulang.",
    "Memanfaatkan kembali material tekstil."
  ],
  [
    "everyday-carry",
    "Reusable Shopping Bag",
    "reusable-shopping-bag",
    45000,
    "Tas belanja lipat yang mudah dibawa.",
    "Dapat digunakan berulang kali untuk mengurangi kantong sekali pakai."
  ],
  [
    "everyday-carry",
    "Upcycled Laptop Sleeve",
    "upcycled-laptop-sleeve",
    149000,
    "Pelindung laptop berbahan tekstil upcycled.",
    "Memanfaatkan kembali material tekstil menjadi produk fungsional."
  ],
];

// ===================================
// 3. SEED DATABASE
// ===================================

async function main() {
  console.log("Starting BUMI database seeding...");

  const categoryIds = {};

  // Insert atau update kategori
  for (const category of categories) {
    const result = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });

    categoryIds[category.slug] = result.id;
  }

  console.log("5 categories seeded.");

  // Insert atau update produk
  for (const product of products) {
    const [
      categorySlug,
      name,
      slug,
      price,
      description,
      sustainabilityInfo,
    ] = product;

    const data = {
      name,
      description,
      price,
      stock: 25,
      imageUrl: null,
      sustainabilityInfo,
      isActive: true,
      categoryId: categoryIds[categorySlug],
    };

    await prisma.product.upsert({
      where: { slug },
      update: data,
      create: {
        slug,
        ...data,
      },
    });
  }

  const categoryCount = await prisma.category.count();
  const productCount = await prisma.product.count();

  console.log("Database seeding completed!");
  console.log(`Total categories: ${categoryCount}`);
  console.log(`Total products: ${productCount}`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
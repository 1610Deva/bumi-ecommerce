// Run from server/: node scripts/link-product-images.js
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const prisma = require("../src/lib/prisma");

const imageDir = path.resolve(__dirname, "../../client/public/images/products");
const extList = [".webp", ".jpg", ".jpeg", ".png"];

async function main() {
  if (!fs.existsSync(imageDir)) {
    throw new Error(`Folder tidak ditemukan: ${imageDir}`);
  }
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true, imageUrl: true },
  });
  let updated = 0;
  let skipped = 0;
  for (const product of products) {
    const ext = extList.find((suffix) =>
      fs.existsSync(path.join(imageDir, `${product.slug}${suffix}`))
    );
    if (!ext) {
      console.log(`NO FILE: ${product.name} (${product.slug})`);
      skipped++;
      continue;
    }
    const imageUrl = `/images/products/${product.slug}${ext}`;
    if (product.imageUrl === imageUrl) {
      console.log(`ALREADY LINKED: ${product.name}`);
      skipped++;
      continue;
    }
    // Do not overwrite a customized external image URL without review.
    if (product.imageUrl && !product.imageUrl.startsWith('/images/products/')) {
      console.log(`CUSTOM IMAGE SKIPPED: ${product.name}`);
      skipped++;
      continue;
    }
    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl },
    });
    console.log(`LINKED: ${product.name} -> ${imageUrl}`);
    updated++;
  }
  console.log(`\nUpdated: ${updated} | Skipped: ${skipped} | Total products: ${products.length}`);
}

main()
  .catch((err) => { console.error(err); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });

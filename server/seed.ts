import { db } from "./db";
import { categories, products } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(products);
  await db.delete(categories);

  // Create categories
  const categoryData = [
    {
      name: "Premium Perfumes",
      description: "Luxury designer fragrances from world-renowned brands",
      image: "/attached_assets/generated_images/Scent_collection_category_image_863be1ae.png",
      productCount: 4,
    },
    {
      name: "Traditional Attar",
      description: "Authentic Arabian oil-based fragrances crafted with finest ingredients",
      image: "/attached_assets/generated_images/Attar_collection_category_image_262b83c4.png",
      productCount: 3,
    },
    {
      name: "Body Sprays",
      description: "Fresh and long-lasting body mists for everyday elegance",
      image: "/attached_assets/generated_images/Body_spray_collection_image_78ba13da.png",
      productCount: 3,
    },
  ];

  await db.insert(categories).values(categoryData);
  const createdCategories = await db.select().from(categories);
  console.log(`Created ${createdCategories.length} categories`);

  // Find category IDs by name for reliable mapping
  const perfumeCategory = createdCategories.find(c => c.name === "Premium Perfumes");
  const attarCategory = createdCategories.find(c => c.name === "Traditional Attar");
  const sprayCategory = createdCategories.find(c => c.name === "Body Sprays");

  if (!perfumeCategory || !attarCategory || !sprayCategory) {
    throw new Error("Failed to create categories");
  }

  // Create products
  const productsData = [
    // Perfumes
    {
      name: "Elegant Rose Essence",
      brand: "Luxury Fragrances",
      description: "A timeless floral fragrance featuring premium rose extracts with notes of jasmine and vanilla",
      price: "8999.00",
      image: "/attached_assets/generated_images/Product_card_perfume_1_d7380d71.png",
      categoryId: perfumeCategory.id,
      rating: 5,
      stock: 50,
    },
    {
      name: "Midnight Oud",
      brand: "Premium Collection",
      description: "Rich and sophisticated oud fragrance with hints of amber and sandalwood",
      price: "12000.00",
      image: "/attached_assets/generated_images/Product_card_perfume_2_7581cb26.png",
      categoryId: perfumeCategory.id,
      rating: 5,
      stock: 30,
    },
    {
      name: "Ocean Breeze",
      brand: "Fresh Collection",
      description: "Light and refreshing aquatic scent perfect for daily wear",
      price: "6500.00",
      image: "/attached_assets/generated_images/Product_sample_perfume_bottle_5df1c02b.png",
      categoryId: perfumeCategory.id,
      rating: 4,
      stock: 75,
    },
    {
      name: "Jasmine Night",
      brand: "Luxury Fragrances",
      description: "Exotic jasmine blend with citrus top notes and musky base",
      price: "9500.00",
      image: "/attached_assets/generated_images/Product_card_perfume_1_d7380d71.png",
      categoryId: perfumeCategory.id,
      rating: 5,
      stock: 40,
    },
    // Attar
    {
      name: "Royal Attar Gold",
      brand: "Traditional Scents",
      description: "Premium attar oil with authentic saffron and musk blend",
      price: "7550.00",
      image: "/attached_assets/generated_images/Product_card_attar_bottle_2b233b12.png",
      categoryId: attarCategory.id,
      rating: 5,
      stock: 25,
    },
    {
      name: "Amber Mystique",
      brand: "Traditional Scents",
      description: "Warm amber attar with hints of honey and spices",
      price: "6800.00",
      image: "/attached_assets/generated_images/Product_card_attar_bottle_2b233b12.png",
      categoryId: attarCategory.id,
      rating: 5,
      stock: 30,
    },
    {
      name: "Sandalwood Pure",
      brand: "Traditional Scents",
      description: "Pure sandalwood attar oil from sustainable sources",
      price: "8500.00",
      image: "/attached_assets/generated_images/Product_card_attar_bottle_2b233b12.png",
      categoryId: attarCategory.id,
      rating: 5,
      stock: 20,
    },
    // Body Sprays
    {
      name: "Velvet Mist",
      brand: "Daily Essentials",
      description: "Gentle body spray with soft floral and fruity notes",
      price: "3500.00",
      image: "/attached_assets/generated_images/Product_sample_perfume_bottle_5df1c02b.png",
      categoryId: sprayCategory.id,
      rating: 4,
      stock: 100,
    },
    {
      name: "Citrus Burst",
      brand: "Daily Essentials",
      description: "Energizing citrus body spray perfect for morning freshness",
      price: "3200.00",
      image: "/attached_assets/generated_images/Product_sample_perfume_bottle_5df1c02b.png",
      categoryId: sprayCategory.id,
      rating: 4,
      stock: 120,
    },
    {
      name: "Lavender Dreams",
      brand: "Daily Essentials",
      description: "Calming lavender body mist ideal for relaxation",
      price: "3800.00",
      image: "/attached_assets/generated_images/Product_sample_perfume_bottle_5df1c02b.png",
      categoryId: sprayCategory.id,
      rating: 5,
      stock: 80,
    },
  ];

  await db.insert(products).values(productsData);
  const createdProducts = await db.select().from(products);
  console.log(`Created ${createdProducts.length} products`);

  console.log("\nDatabase seeded successfully!");
  console.log(`- ${createdCategories.length} categories`);
  console.log(`- ${createdProducts.length} products`);
}

seed()
  .then(() => {
    console.log("Seed completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });

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
    {
      name: "Gift Sets",
      description: "Beautifully curated fragrance gift sets perfect for special occasions",
      image: "/attached_assets/generated_images/Scent_collection_category_image_863be1ae.png",
      productCount: 3,
    },
    {
      name: "Unisex Fragrances",
      description: "Modern scents designed for everyone, breaking traditional boundaries",
      image: "/attached_assets/generated_images/Product_card_perfume_2_7581cb26.png",
      productCount: 3,
    },
    {
      name: "Incense & Bakhoor",
      description: "Traditional Arabian incense and bakhoor for home fragrance",
      image: "/attached_assets/generated_images/Attar_collection_category_image_262b83c4.png",
      productCount: 3,
    },
    {
      name: "Fragrance Oils",
      description: "Pure concentrated fragrance oils for long-lasting scent",
      image: "/attached_assets/generated_images/Product_card_attar_bottle_2b233b12.png",
      productCount: 2,
    },
  ];

  await db.insert(categories).values(categoryData);
  const createdCategories = await db.select().from(categories);
  console.log(`Created ${createdCategories.length} categories`);

  // Find category IDs by name for reliable mapping
  const perfumeCategory = createdCategories.find(c => c.name === "Premium Perfumes");
  const attarCategory = createdCategories.find(c => c.name === "Traditional Attar");
  const sprayCategory = createdCategories.find(c => c.name === "Body Sprays");
  const giftSetCategory = createdCategories.find(c => c.name === "Gift Sets");
  const unisexCategory = createdCategories.find(c => c.name === "Unisex Fragrances");
  const incenseCategory = createdCategories.find(c => c.name === "Incense & Bakhoor");
  const oilCategory = createdCategories.find(c => c.name === "Fragrance Oils");

  if (!perfumeCategory || !attarCategory || !sprayCategory || !giftSetCategory || !unisexCategory || !incenseCategory || !oilCategory) {
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
    // Gift Sets
    {
      name: "Luxury Collection Gift Set",
      brand: "Premium Collection",
      description: "Exclusive gift set featuring our best perfumes in elegant packaging",
      price: "15000.00",
      image: "/attached_assets/generated_images/Scent_collection_category_image_863be1ae.png",
      categoryId: giftSetCategory.id,
      rating: 5,
      stock: 20,
    },
    {
      name: "Arabian Nights Gift Set",
      brand: "Traditional Scents",
      description: "Collection of premium attar oils and incense in luxury box",
      price: "12500.00",
      image: "/attached_assets/generated_images/Attar_collection_category_image_262b83c4.png",
      categoryId: giftSetCategory.id,
      rating: 5,
      stock: 15,
    },
    {
      name: "Travel Essentials Set",
      brand: "Daily Essentials",
      description: "Perfect travel-sized fragrances for on-the-go freshness",
      price: "7500.00",
      image: "/attached_assets/generated_images/Product_sample_perfume_bottle_5df1c02b.png",
      categoryId: giftSetCategory.id,
      rating: 4,
      stock: 30,
    },
    // Unisex Fragrances
    {
      name: "Eternal Balance",
      brand: "Modern Scents",
      description: "Fresh citrus and woody notes perfect for any occasion",
      price: "9800.00",
      image: "/attached_assets/generated_images/Product_card_perfume_2_7581cb26.png",
      categoryId: unisexCategory.id,
      rating: 5,
      stock: 45,
    },
    {
      name: "Urban Spirit",
      brand: "Modern Scents",
      description: "Contemporary blend of bergamot, cedar, and musk",
      price: "10500.00",
      image: "/attached_assets/generated_images/Product_card_perfume_1_d7380d71.png",
      categoryId: unisexCategory.id,
      rating: 5,
      stock: 35,
    },
    {
      name: "Natural Harmony",
      brand: "Modern Scents",
      description: "Organic ingredients with earthy and floral undertones",
      price: "8900.00",
      image: "/attached_assets/generated_images/Product_sample_perfume_bottle_5df1c02b.png",
      categoryId: unisexCategory.id,
      rating: 4,
      stock: 40,
    },
    // Incense & Bakhoor
    {
      name: "Royal Bakhoor",
      brand: "Arabian Heritage",
      description: "Premium bakhoor chips with oud and amber essence",
      price: "4500.00",
      image: "/attached_assets/generated_images/Attar_collection_category_image_262b83c4.png",
      categoryId: incenseCategory.id,
      rating: 5,
      stock: 60,
    },
    {
      name: "Sandalwood Incense Sticks",
      brand: "Arabian Heritage",
      description: "Pure sandalwood incense sticks for meditation and relaxation",
      price: "2500.00",
      image: "/attached_assets/generated_images/Attar_collection_category_image_262b83c4.png",
      categoryId: incenseCategory.id,
      rating: 5,
      stock: 100,
    },
    {
      name: "Oudh Bakhoor Premium",
      brand: "Arabian Heritage",
      description: "Luxury bakhoor with authentic oudh and rose extracts",
      price: "5500.00",
      image: "/attached_assets/generated_images/Product_card_attar_bottle_2b233b12.png",
      categoryId: incenseCategory.id,
      rating: 5,
      stock: 50,
    },
    // Fragrance Oils
    {
      name: "Pure Musk Oil",
      brand: "Essential Oils",
      description: "Concentrated musk fragrance oil for long-lasting scent",
      price: "5800.00",
      image: "/attached_assets/generated_images/Product_card_attar_bottle_2b233b12.png",
      categoryId: oilCategory.id,
      rating: 5,
      stock: 35,
    },
    {
      name: "Rose Garden Oil",
      brand: "Essential Oils",
      description: "Pure rose fragrance oil extracted from premium blooms",
      price: "6200.00",
      image: "/attached_assets/generated_images/Product_card_attar_bottle_2b233b12.png",
      categoryId: oilCategory.id,
      rating: 5,
      stock: 30,
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

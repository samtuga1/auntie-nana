import type { IAdmin, ICustomer, IOrder, IProduct, IProductCategory } from "@/interfaces"

/**
 * Seed data for the mock backend.
 *
 * Everything here is demo content so the app is fully clickable before the API
 * exists. Delete `lib/mock/` and set NEXT_PUBLIC_USE_MOCKS=false once the real
 * backend is wired up.
 */

export const MOCK_CATEGORIES: IProductCategory[] = [
  { _id: "cat_spices", name: "Spices & Seasonings", slug: "spices-seasonings" },
  { _id: "cat_powdered", name: "Powdered Foods", slug: "powdered-foods" },
  { _id: "cat_cereals", name: "Instant Cereals", slug: "instant-cereals" },
]

export const CATEGORY_BLURBS: Record<string, string> = {
  cat_spices:
    "Wet pastes and dry powders that carry the full depth of Ghanaian flavour — no shortcuts, no additives.",
  cat_powdered:
    "Banku, fufu, koko and more. The staples you grew up on, milled fine and ready in minutes.",
  cat_cereals:
    "Warm, filling breakfasts and gari mixes made from fonio, maize and rice. Just add water.",
}

type Seed = {
  slug: string
  name: string
  categoryId: string
  price: number
  comparePrice?: number
  stock: number
  weight: string
  description: string
  featured?: boolean
}

const SEEDS: Seed[] = [
  // ── Spices & Seasonings ────────────────────────────────────────────────────
  {
    slug: "jollof-seasoning-powder",
    name: "Jollof Seasoning Powder",
    categoryId: "cat_spices",
    price: 12,
    comparePrice: 15,
    stock: 240,
    weight: "5g sachet",
    featured: true,
    description:
      "The one that gets your jollof right every single time. A balanced blend of tomato, pepper, onion and warm Ghanaian spices — measured so you never have to guess.",
  },
  {
    slug: "stew-seasoning-powder",
    name: "Stew Seasoning Powder",
    categoryId: "cat_spices",
    price: 12,
    stock: 180,
    weight: "5g sachet",
    description:
      "Rich, deep and slow-cooked in flavour without the slow cooking. Built for light soup, palava sauce and everyday stew.",
  },
  {
    slug: "chicken-seasoning-powder",
    name: "Chicken Seasoning Powder",
    categoryId: "cat_spices",
    price: 12,
    stock: 200,
    weight: "5g sachet",
    featured: true,
    description:
      "Everything chicken needs and nothing it doesn't. Season, rest, and cook — grilled, fried or stewed.",
  },
  {
    slug: "fish-seasoning-powder",
    name: "Fish Seasoning Powder",
    categoryId: "cat_spices",
    price: 12,
    stock: 165,
    weight: "5g sachet",
    description:
      "Ginger, garlic and pepper tuned for fresh fish. Cuts through and lifts the flavour instead of covering it.",
  },
  {
    slug: "all-purpose-seasoning-powder",
    name: "All Purpose Seasoning Powder",
    categoryId: "cat_spices",
    price: 12,
    stock: 300,
    weight: "5g sachet",
    featured: true,
    description:
      "The jack-of-all-trades sachet that belongs in every kitchen. Works on meat, vegetables, rice and everything in between.",
  },
  {
    slug: "garlic-ginger-onion-seasoning",
    name: "Garlic, Ginger & Onion Seasoning",
    categoryId: "cat_spices",
    price: 14,
    stock: 145,
    weight: "5g sachet",
    description:
      "The three aromatics every Ghanaian dish starts with, dried and milled so you skip the chopping and the tears.",
  },
  {
    slug: "shito-red",
    name: "Spicy Red Pepper Sauce (Shito)",
    categoryId: "cat_spices",
    price: 28,
    comparePrice: 34,
    stock: 90,
    weight: "10g sachet",
    featured: true,
    description:
      "Bright, sharp and properly hot. Fresh red pepper ground with onion and spices — for rice, kenkey, yam and anything that needs waking up.",
  },
  {
    slug: "shito-black",
    name: "Spicy Black Pepper Sauce (Shito)",
    categoryId: "cat_spices",
    price: 30,
    stock: 76,
    weight: "10g sachet",
    description:
      "The classic black shito — dried pepper, ginger and fish, cooked down slow until it's deep and smoky.",
  },
  {
    slug: "shito-green",
    name: "Spicy Green Pepper Sauce (Shito)",
    categoryId: "cat_spices",
    price: 28,
    stock: 58,
    weight: "10g sachet",
    description:
      "Fresh green pepper ground raw with onion and herbs. Lighter and sharper than black shito — excellent with grilled fish.",
  },

  // ── Powdered Foods ─────────────────────────────────────────────────────────
  {
    slug: "banku-mix-powder",
    name: "Banku Mix Powder",
    categoryId: "cat_powdered",
    price: 32,
    stock: 120,
    weight: "1kg",
    featured: true,
    description:
      "Properly fermented corn and cassava, milled and ready. Stir into hot water and you have smooth banku in minutes — no three-day wait.",
  },
  {
    slug: "plantain-fufu-flour",
    name: "Plantain Fufu Flour",
    categoryId: "cat_powdered",
    price: 35,
    comparePrice: 40,
    stock: 110,
    weight: "1kg",
    featured: true,
    description:
      "Fufu without the pounding. Made from unripe plantain and cassava for that soft, stretchy texture you know.",
  },
  {
    slug: "hausa-koko-powder",
    name: "Hausa Koko Powder",
    categoryId: "cat_powdered",
    price: 26,
    stock: 140,
    weight: "700g",
    description:
      "Spiced millet porridge, the way it's sold on the roadside at 6am — ginger, cloves and pepper already in the mix.",
  },
  {
    slug: "soy-pancake-mix",
    name: "Soy Pancake Mix",
    categoryId: "cat_powdered",
    price: 30,
    stock: 95,
    weight: "700g",
    description:
      "Protein-rich soy pancakes in one bowl. Add water, whisk, fry — breakfast handled before the school run.",
  },
  {
    slug: "bofrot-mix",
    name: "Bofrot Mix",
    categoryId: "cat_powdered",
    price: 28,
    stock: 85,
    weight: "700g",
    description:
      "Sweet, airy bofrot every time. The flour, sugar and yeast are already measured — you just add water and let it rise.",
  },
  {
    slug: "cereal-legume-mix-flour",
    name: "Cereal Legume Mix Flour",
    categoryId: "cat_powdered",
    price: 34,
    stock: 105,
    weight: "1kg",
    description:
      "Maize, soy and groundnut blended for a complete protein porridge. A weaning favourite that adults keep stealing.",
  },

  // ── Instant Cereals ────────────────────────────────────────────────────────
  {
    slug: "fonio-cereal-mix",
    name: "Fonio Instant Cereal Mix",
    categoryId: "cat_cereals",
    price: 24,
    comparePrice: 29,
    stock: 160,
    weight: "125g",
    featured: true,
    description:
      "Ancient West African grain, naturally gluten-free and low GI. Ready in 2 minutes and keeps you full till lunch.",
  },
  {
    slug: "maize-instant-cereal",
    name: "Maize Instant Cereal Mix",
    categoryId: "cat_cereals",
    price: 20,
    stock: 210,
    weight: "125g",
    description:
      "Smooth roasted maize porridge with no lumps and no stirring over a hot fire. Just hot water and a spoon.",
  },
  {
    slug: "rice-instant-cereal",
    name: "Rice Instant Cereal Mix",
    categoryId: "cat_cereals",
    price: 20,
    stock: 190,
    weight: "125g",
    description:
      "Gentle, easy-to-digest rice cereal. The one to reach for on early mornings and delicate stomachs.",
  },
  {
    slug: "fruity-gari-mix",
    name: "Fruity Gari Mix",
    categoryId: "cat_cereals",
    price: 22,
    stock: 175,
    weight: "115g",
    featured: true,
    description:
      "Gari soakings, upgraded. Crisp gari with real dried pineapple, banana and coconut — no fridge, no prep, no fuss.",
  },
  {
    slug: "fruity-gari-mix-no-sugar",
    name: "Fruity Gari Mix (No Sugar)",
    categoryId: "cat_cereals",
    price: 22,
    stock: 130,
    weight: "115g",
    description:
      "All the fruit, none of the added sugar. Sweetened only by the dried fruit itself — a favourite with health-conscious customers.",
  },
  {
    slug: "fruity-chocolate-gari-mix",
    name: "Fruity Chocolate Gari Mix",
    categoryId: "cat_cereals",
    price: 25,
    stock: 118,
    weight: "115g",
    description:
      "Ghanaian cocoa meets crisp gari and dried fruit. The one the children ask for by name.",
  },
]

const now = Date.now()
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString()

export const MOCK_PRODUCTS: IProduct[] = SEEDS.map((s, i) => ({
  _id: `prod_${s.slug}`,
  name: s.name,
  slug: s.slug,
  description: s.description,
  price: s.price,
  comparePrice: s.comparePrice,
  imageUrls: [`/products/${s.slug}.png`],
  category: MOCK_CATEGORIES.find((c) => c._id === s.categoryId)!,
  stock: s.stock,
  weight: s.weight,
  featured: s.featured ?? false,
  isPublished: true,
  createdAt: daysAgo(60 - i),
  updatedAt: daysAgo(30 - (i % 30)),
}))

export const MOCK_ADMINS: IAdmin[] = [
  {
    _id: "adm_1",
    name: "Nana Ama Boateng",
    email: "admin@auntienana.com",
    isSuperAdmin: true,
    isSuspended: false,
    createdAt: daysAgo(400),
  },
  {
    _id: "adm_2",
    name: "Kwame Mensah",
    email: "sales@auntienana.com",
    isSuperAdmin: false,
    isSuspended: false,
    createdAt: daysAgo(120),
  },
  {
    _id: "adm_3",
    name: "Efua Danso",
    email: "support@auntienana.com",
    isSuperAdmin: false,
    isSuspended: true,
    createdAt: daysAgo(64),
  },
]

/** Demo passwords — mock sign-in accepts these (or any password, for convenience). */
export const MOCK_PASSWORD = "password123"

export const MOCK_CUSTOMERS: ICustomer[] = [
  { _id: "cus_1", name: "Adwoa Sarpong", email: "adwoa.sarpong@gmail.com", phone: "+233244118090", totalOrders: 7, totalSpent: 612, createdAt: daysAgo(210) },
  { _id: "cus_2", name: "Yaw Antwi", email: "yaw.antwi@gmail.com", phone: "+233201447726", totalOrders: 3, totalSpent: 268, createdAt: daysAgo(150) },
  { _id: "cus_3", name: "Akosua Frimpong", email: "akosua.f@outlook.com", phone: "+233559023844", totalOrders: 12, totalSpent: 1184, createdAt: daysAgo(320) },
  { _id: "cus_4", name: "Kojo Asante", email: "kojo.asante@yahoo.com", phone: "+233277610355", totalOrders: 2, totalSpent: 96, createdAt: daysAgo(48) },
  { _id: "cus_5", name: "Mariam Issah", email: "mariam.issah@gmail.com", phone: "+233246778201", totalOrders: 5, totalSpent: 430, createdAt: daysAgo(96) },
  { _id: "cus_6", name: "Selorm Agbeko", email: "selorm.a@gmail.com", phone: "+233208844117", totalOrders: 1, totalSpent: 58, createdAt: daysAgo(12) },
]

const p = (slug: string) => MOCK_PRODUCTS.find((x) => x.slug === slug)!

function line(slug: string, quantity: number) {
  const prod = p(slug)
  return {
    product: { _id: prod._id, name: prod.name, price: prod.price, imageUrls: prod.imageUrls },
    quantity,
    unitPrice: prod.price,
  }
}

function buildOrder(
  n: number,
  customer: ICustomer,
  items: ReturnType<typeof line>[],
  status: IOrder["status"],
  paymentStatus: IOrder["paymentStatus"],
  createdDaysAgo: number,
  deliveryAddress: string
): IOrder {
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
  const delivery = 25
  return {
    _id: `ord_${n}`,
    orderNumber: `AN-${1200 + n}`,
    customer,
    items,
    subtotal,
    total: subtotal + delivery,
    status,
    paymentStatus,
    paystackReference: `an_ref_${900000 + n}`,
    deliveryAddress,
    createdAt: daysAgo(createdDaysAgo),
    updatedAt: daysAgo(Math.max(0, createdDaysAgo - 1)),
  }
}

export const MOCK_ORDERS: IOrder[] = [
  buildOrder(1, MOCK_CUSTOMERS[2], [line("banku-mix-powder", 2), line("shito-red", 1)], "delivered", "paid", 2, "12 Ring Road East, Osu, Accra"),
  buildOrder(2, MOCK_CUSTOMERS[0], [line("jollof-seasoning-powder", 4), line("all-purpose-seasoning-powder", 2)], "shipped", "paid", 3, "Ashongman Estates, Block C, Accra"),
  buildOrder(3, MOCK_CUSTOMERS[4], [line("fruity-gari-mix", 3), line("fonio-cereal-mix", 2)], "processing", "paid", 4, "Kasoa Millennium City, Central Region"),
  buildOrder(4, MOCK_CUSTOMERS[1], [line("plantain-fufu-flour", 1)], "pending", "unpaid", 5, "Dansoman Last Stop, Accra"),
  buildOrder(5, MOCK_CUSTOMERS[3], [line("hausa-koko-powder", 2), line("maize-instant-cereal", 4)], "delivered", "paid", 8, "Kwabenya ACP Junction, Accra"),
  buildOrder(6, MOCK_CUSTOMERS[2], [line("shito-black", 2), line("chicken-seasoning-powder", 3)], "delivered", "paid", 11, "East Legon Hills, Accra"),
  buildOrder(7, MOCK_CUSTOMERS[5], [line("bofrot-mix", 1), line("soy-pancake-mix", 1)], "cancelled", "refunded", 14, "Adenta Housing Down, Accra"),
  buildOrder(8, MOCK_CUSTOMERS[4], [line("fruity-chocolate-gari-mix", 5)], "delivered", "paid", 19, "Tema Community 25, Greater Accra"),
  buildOrder(9, MOCK_CUSTOMERS[0], [line("stew-seasoning-powder", 6), line("fish-seasoning-powder", 4)], "delivered", "paid", 24, "Ashongman Estates, Block C, Accra"),
  buildOrder(10, MOCK_CUSTOMERS[1], [line("cereal-legume-mix-flour", 2), line("rice-instant-cereal", 3)], "delivered", "paid", 29, "Dansoman Last Stop, Accra"),
]

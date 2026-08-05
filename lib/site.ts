/** Single source of truth for storefront copy and contact details. */
export const SITE = {
  brand: "Auntie Nana",
  company: "Samaace Holdings Ltd.",
  tagline: "The taste of home, made fast and easy",
  bigIdea: "Convenience meets nutrition and authentic taste",
  description:
    "Authentic Ghanaian meals and seasonings made with locally sourced ingredients. Quick to prepare, healthy to eat — just the way Grandma makes it.",
  phone: "+233 30 123 4567",
  whatsapp: "+233 24 000 0000",
  email: "hello@auntienana.com",
  address: "Spintex Road, Accra, Ghana",
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
  },
} as const

export const NAV_LINKS = [
  { label: "Shop", href: "/products" },
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const

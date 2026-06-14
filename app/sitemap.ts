import type { MetadataRoute } from "next";
import { PRODUCTS } from "./lib/products";
import { SITE_URL } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/beta`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...PRODUCTS.map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: product.beta ? 0.85 : 0.75,
    })),
  ];
}

const DEFAULT_STRAPI_URL = "http://localhost:1337";

export const API_URL = (
  process.env.NEXT_PUBLIC_STRAPI_URL ?? DEFAULT_STRAPI_URL
).replace(/\/$/, "");

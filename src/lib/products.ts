export function getProductDetailPath(slug: string) {
  if (slug === "faultcode") {
    return "/faultcode";
  }

  return `/products/${slug}`;
}

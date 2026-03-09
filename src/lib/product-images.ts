export const DEFAULT_PRODUCT_IMAGE = "/products/placeholder-product.svg";

function normalizeImageUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function resolveProductImage(
  primary?: string | null,
  images?: string[] | null
): string {
  const fromPrimary = normalizeImageUrl(primary);
  if (fromPrimary) return fromPrimary;

  const fromImages = (images ?? []).map(normalizeImageUrl).find(Boolean);
  if (fromImages) return fromImages;

  return DEFAULT_PRODUCT_IMAGE;
}

export function resolveProductImages(
  primary?: string | null,
  images?: string[] | null
): string[] {
  const normalized = (images ?? [])
    .map((image) => normalizeImageUrl(image))
    .filter((image): image is string => Boolean(image));

  if (normalized.length > 0) {
    return normalized;
  }

  return [resolveProductImage(primary, images)];
}

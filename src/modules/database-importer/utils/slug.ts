/**
 * Slug utility
 * Generate URL-friendly slugs from item names
 */

export function createSlug(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^a-z0-9\-]/g, '')
    // Replace multiple hyphens with single
    .replace(/\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^\-+|\-+$/g, '');
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9\-]+$/.test(slug) && slug.length > 0;
}

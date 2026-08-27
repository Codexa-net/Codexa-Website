/**
 * Shared upload rules.
 *
 * The extension is derived from the detected mime type rather than from the
 * name the client sent, so a file called "logo.php" that really is a PNG is
 * stored as ".png", and one called "logo.png" that is not an image is refused.
 */
export const ALLOWED_IMAGE_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const UPLOADS_ROUTE_PREFIX = '/uploads';

/** Filenames this API generates: 32 hex characters, then a known extension. */
export const STORED_FILENAME_PATTERN = new RegExp(
  `^[0-9a-f]{32}\\.(${Object.values(ALLOWED_IMAGE_MIME_TYPES).join('|')})$`,
);

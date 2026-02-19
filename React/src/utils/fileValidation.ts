export const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB

export const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'image/webp',
  'image/heic',
  'image/heif',
]);

export interface FileValidationResult {
  ok: boolean;
  error?: string;
}

export function validateFile(file: File): FileValidationResult {
  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 50 MB.`,
    };
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return {
      ok: false,
      error: `Unsupported file type "${file.type}". Please select a JPEG, PNG, GIF, SVG, WebP, or HEIC image.`,
    };
  }
  return { ok: true };
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'atc7jukt';
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '581542198426464';
const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET || 'qs242Xtphy9zM4dtphj09RqWXNE';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Allowed: PNG, JPG, WebP, GIF, AVIF.`,
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }
  return { valid: true };
}

async function sha1Hex(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Extracts Cloudinary public_id (including folder path) from a Cloudinary asset URL.
 * Example: "https://res.cloudinary.com/atc7jukt/image/upload/v1785488275/portfolio-projects/antqa67s3ky1ndnos9hu.png"
 * Returns: "portfolio-projects/antqa67s3ky1ndnos9hu"
 */
export function extractPublicId(url: string): string | null {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return null;
  }
  try {
    const cleanUrl = url.split('?')[0];
    const match = cleanUrl.match(/\/upload\/(?:[^\/]+\/)*(?:v\d+\/)?(.+)$/);
    if (!match || !match[1]) return null;

    let fullPath = match[1];
    const lastDotIndex = fullPath.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      fullPath = fullPath.substring(0, lastDotIndex);
    }
    return fullPath;
  } catch {
    return null;
  }
}

/**
 * Uploads an image directly to Cloudinary with real-time XHR progress updates.
 */
export function uploadImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return reject(new Error(validation.error || 'Invalid image file.'));
    }

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const folder = 'portfolio-projects';

      const formData = new FormData();
      formData.append('file', file);

      if (API_KEY && API_SECRET) {
        formData.append('api_key', API_KEY);
        formData.append('timestamp', String(timestamp));
        formData.append('folder', folder);

        const stringToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
        const signature = await sha1Hex(stringToSign);
        formData.append('signature', signature);
      } else if (UPLOAD_PRESET) {
        formData.append('upload_preset', UPLOAD_PRESET);
      }

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl, true);

      if (onProgress && xhr.upload) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.secure_url) {
              resolve(response.secure_url);
            } else if (response.url) {
              resolve(response.url);
            } else {
              reject(new Error('Cloudinary response did not contain an image URL.'));
            }
          } catch {
            reject(new Error('Invalid response received from Cloudinary.'));
          }
        } else {
          try {
            const errRes = JSON.parse(xhr.responseText);
            reject(new Error(errRes.error?.message || `Cloudinary upload failed (status ${xhr.status}).`));
          } catch {
            reject(new Error(`Cloudinary upload failed with HTTP status ${xhr.status}.`));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network connection error during Cloudinary image upload.'));
      };

      xhr.send(formData);
    } catch (err) {
      reject(err instanceof Error ? err : new Error('Unexpected Cloudinary upload error.'));
    }
  });
}

/**
 * Permanently deletes an asset from Cloudinary storage using its public_id or image URL.
 */
export async function deleteImage(publicIdOrUrl: string): Promise<boolean> {
  if (!publicIdOrUrl) return false;
  const publicId = extractPublicId(publicIdOrUrl) || publicIdOrUrl;
  if (!publicId || publicId.startsWith('http') || publicId.startsWith('data:')) {
    return false;
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const formData = new FormData();

    if (API_KEY && API_SECRET) {
      formData.append('public_id', publicId);
      formData.append('api_key', API_KEY);
      formData.append('timestamp', String(timestamp));

      const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
      const signature = await sha1Hex(stringToSign);
      formData.append('signature', signature);

      const destroyUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`;
      const res = await fetch(destroyUrl, { method: 'POST', body: formData });
      const data = await res.json();
      return data.result === 'ok';
    }
    return false;
  } catch (error) {
    console.warn('Cloudinary delete warning:', error);
    return false;
  }
}

/**
 * Updates a project image by uploading the new image first.
 * Only after the new upload succeeds, the old image is deleted from Cloudinary storage.
 * Prevents orphaned files and ensures fallback safety if upload fails.
 */
export async function updateImage(
  newFile: File,
  oldUrl?: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Step 1: Upload new image
  const newUrl = await uploadImage(newFile, onProgress);

  // Step 2: Delete old image only after successful upload
  if (oldUrl && oldUrl !== newUrl) {
    void deleteImage(oldUrl);
  }

  return newUrl;
}

/**
 * Inserts auto quality, auto format (WebP/AVIF), and dynamic dimensions into Cloudinary URLs.
 * Keeps non-Cloudinary image URLs intact for backward compatibility.
 */
export function optimizeImage(
  url: string,
  options?: { width?: number; height?: number; quality?: string; format?: string; crop?: string }
): string {
  if (!url || typeof url !== 'string') return url || '';
  if (!url.includes('res.cloudinary.com')) return url;

  if (url.includes('/upload/f_auto') || url.includes('/upload/w_')) return url;

  const { width, height, quality = 'auto', format = 'auto', crop } = options || {};
  const transforms: string[] = [`f_${format}`, `q_${quality}`];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);

  const transformString = transforms.join(',');
  return url.replace('/upload/', `/upload/${transformString}/`);
}

/**
 * Returns a CDN-optimized thumbnail version of an image URL.
 */
export function generateThumbnail(url: string, width = 800, height = 450): string {
  return optimizeImage(url, { width, height, crop: 'fill', quality: 'auto', format: 'auto' });
}

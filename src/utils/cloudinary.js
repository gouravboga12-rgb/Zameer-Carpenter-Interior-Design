export const CLOUDINARY_CLOUD_NAME = 'lyjntirb';
export const CLOUDINARY_UPLOAD_PRESET = 'Zameer_preset';

/**
 * Uploads a File (image or video) directly to Cloudinary
 * @param {File} file - The binary file to upload
 * @returns {Promise<string>} The uploaded HTTPS URL from Cloudinary
 */
export async function uploadToCloudinary(file) {
  if (!file) throw new Error('No file provided for upload');

  const isVideo = file.type.startsWith('video/');
  const resourceType = isVideo ? 'video' : 'image';
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Cloudinary upload returned non-OK status:', errorData);
      // If signed/preset issue occurs, fallback to local FileReader data URL
      return await readFileAsDataURL(file);
    }

    const data = await response.json();
    return data.secure_url || data.url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // Fallback to local Data URL representation if network/preset upload fails
    return await readFileAsDataURL(file);
  }
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

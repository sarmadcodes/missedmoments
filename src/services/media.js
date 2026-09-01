import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { api } from './api';

/**
 * Photo upload, signed-direct style.
 *
 * The app asks the API for a short-lived signature, uploads the file straight
 * to Cloudinary, then tells the API what landed. Image bytes never pass
 * through our server, so a slow upload does not tie up an API connection and
 * the Cloudinary secret never leaves the backend.
 */

const MAX_BYTES = 10 * 1024 * 1024;

export const pickImage = ({ fromCamera = false } = {}) =>
  new Promise((resolve, reject) => {
    const options = {
      mediaType: 'photo',
      // Resize before upload: a 12MP phone photo is a slow upload on mobile
      // data and Cloudinary would only shrink it anyway.
      maxWidth: 1440,
      maxHeight: 1440,
      quality: 0.85,
      selectionLimit: 1,
    };

    const handler = response => {
      if (response.didCancel) {
        resolve(null);
        return;
      }
      if (response.errorCode) {
        reject(new Error(response.errorMessage || 'Could not open your photos'));
        return;
      }
      const asset = response.assets && response.assets[0];
      if (!asset?.uri) {
        resolve(null);
        return;
      }
      if (asset.fileSize && asset.fileSize > MAX_BYTES) {
        reject(new Error('That image is too large (max 10MB).'));
        return;
      }
      resolve(asset);
    };

    if (fromCamera) {
      launchCamera(options, handler);
    } else {
      launchImageLibrary(options, handler);
    }
  });

/**
 * Uploads one already-picked asset and registers it against the account.
 * Returns the stored photo ({ id, url, publicId }).
 */
export const uploadPhoto = async (asset, { isPrimary } = {}) => {
  const ticket = await api.post('/v1/media/upload-ticket');

  const form = new FormData();
  form.append('file', {
    uri: asset.uri,
    // React Native's FormData needs both of these or the multipart body has
    // no filename and Cloudinary rejects it.
    type: asset.type || 'image/jpeg',
    name: asset.fileName || `upload-${Date.now()}.jpg`,
  });
  form.append('api_key', ticket.apiKey);
  form.append('timestamp', String(ticket.timestamp));
  form.append('signature', ticket.signature);
  form.append('folder', ticket.folder);
  // Must match the signed params exactly, or the signature is rejected.
  form.append('transformation', 'c_limit,w_1440,h_1440,q_auto:good');

  const res = await fetch(ticket.uploadUrl, { method: 'POST', body: form });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok || !data?.public_id) {
    throw new Error(data?.error?.message || 'Upload failed. Please try again.');
  }

  // Registering is what makes the photo real to the app; until this succeeds
  // the asset is orphaned in Cloudinary.
  return api.post('/v1/media/photos', {
    publicId: data.public_id,
    ...(isPrimary === undefined ? {} : { isPrimary }),
  });
};

/** Pick and upload in one step. Resolves to null if the user cancelled. */
export const pickAndUploadPhoto = async options => {
  const asset = await pickImage(options);
  if (!asset) return null;
  return uploadPhoto(asset, options);
};

export const listPhotos = () => api.get('/v1/media/photos');
export const deletePhoto = id => api.delete(`/v1/media/photos/${id}`);
export const setPrimaryPhoto = id => api.patch(`/v1/media/photos/${id}/primary`);
export const uploadsEnabled = () => api.get('/v1/media/status');

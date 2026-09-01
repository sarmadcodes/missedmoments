const FALLBACK_AVATAR = require('../assets/images/overlay1.png');

/**
 * Photos come back as URLs, but a user may have none (photo upload is not
 * wired yet). Image would render nothing for `{uri: null}`, so fall back.
 */
export const avatarSource = url =>
  url ? { uri: url } : FALLBACK_AVATAR;

/** "6 mins ago" from an ISO timestamp. */
export const timeAgo = iso => {
  if (!iso) return '';
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

/** Turns an API error into something worth showing a person. */
export const friendlyError = err => {
  if (!err) return 'Something went wrong.';
  if (err.code === 'TIMEOUT') return 'The server took too long to respond.';
  if (err.code === 'PERMISSION_DENIED')
    return 'Location permission is needed to see who was nearby.';
  if (err.status === 401) return 'Your session expired. Please sign in again.';
  if (err.message?.includes('Network request failed'))
    return 'Cannot reach the server. Check that the API is running.';
  return err.message || 'Something went wrong.';
};

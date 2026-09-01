const FALLBACK_AVATARS = [
  require('../assets/images/overlay1.png'),
  require('../assets/images/overlay2.png'),
  require('../assets/images/overlay3.png'),
  require('../assets/images/overlay4.png'),
];

/**
 * Photos come back as URLs, but a user may have none (photo upload is not
 * wired yet). Image renders nothing for `{uri: null}`, so fall back.
 *
 * The fallback is picked deterministically from `seed` (pass the user id), so
 * a given person always shows the same placeholder and a list does not look
 * like the same face repeated.
 */
export const avatarSource = (url, seed) => {
  if (url) {
    return { uri: url };
  }
  if (!seed) {
    return FALLBACK_AVATARS[0];
  }
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return FALLBACK_AVATARS[hash % FALLBACK_AVATARS.length];
};

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

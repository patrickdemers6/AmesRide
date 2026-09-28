export const ALL_ROUTES = -1;
export const FAVORITE_STOPS = -2;

// eas update does not load the build profile env from eas.json. Without this
// fallback, a preview update publishes the host as undefined.
export const BACKEND_HOST =
  process.env.EXPO_PUBLIC_BACKEND_HOST || 'https://amesride.demerstech.com';

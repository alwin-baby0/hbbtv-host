import { Router } from '@lightningjs/sdk';
import { CMPService, AuthorizationService } from '../Services';
import { ROUTES, LOCAL_STORAGE_KEYS } from '../constants/globalConstants';

export function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

export function capitalizeFirstLetter(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return str; // Handle non-string or empty inputs
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function checkCMP({ cmpShown, url, id }) {
  if (cmpShown) {
    return true;
  }

  await CMPService.initialFetch();
  const expireTs = CMPService.cmpData?.consent?.expire.timestamp;
  const nowTs = Math.floor(Date.now() / 1000);

  if (expireTs === 0 || nowTs > expireTs) {
    const params = { url };

    if (id) {
      params.movieId = id;
    }
    Router.navigate(ROUTES.CMP, params, false);
    return false;
  }
  return true;
}

export async function refreshTokenOnOauth() {
  const refreshResponse = await AuthorizationService.refreshToken();

  if (refreshResponse?.data?.error) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
  } else {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(data));
  }
  window.location.reload();
}

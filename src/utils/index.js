import { AuthorizationService, DidomiService } from '../Services';
import { LOCAL_STORAGE_KEYS } from '../constants/globalConstants';
import { setDidomiVisible } from '../App';
import { Router } from '@lightningjs/sdk';

const defTr = await import(`../../public/static/translations/en.json`);

export function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

export function capitalizeFirstLetter(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return str; // Handle non-string or empty inputs
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function checkCMP() {
  await DidomiService.init();
  const userNotice = window.Didomi.getConfig();

  if (Router.getHistory().length) {
    return;
  }

  if (userNotice.notice.daysBeforeShowingAgain <= 0) {
    await window.Didomi.notice.show();
    setDidomiVisible(true);
  }

  window.didomiOnReady &&
    window.didomiOnReady.push(async () => {
      const userConsent = await window.Didomi.getCurrentUserStatus();
      localStorage.setItem('userConsentString', JSON.stringify(userConsent));

      localStorage.setItem('didomiConfig', JSON.stringify(userNotice));
    });

  return true;
}

export async function refreshTokenOnOauth() {
  const refreshResponse = await AuthorizationService.refreshToken();

  if (refreshResponse?.data?.error || !refreshResponse || typeof refreshResponse === 'string') {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
  } else {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(data));
  }
  window.location.reload();
}

/**
 * @param { keyof typeof defTr } key
 */
export function t(key) {
  const translations = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS)).translation;
  return translations && translations[key] ? translations[key] : defTr[key];
}

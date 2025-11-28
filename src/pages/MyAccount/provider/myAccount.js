import { t, AuthorizationService, UserService } from '../../../Services';
import { LOCAL_STORAGE_KEYS, RAIL_TYPES, TRANSLATIONS } from '../../../constants/globalConstants';
import { parseVodUserContentData } from '../../../Models';

export default async function (page) {
  AuthorizationService.clearPollingInterval();

  !localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
  const response = !localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)
    ? await AuthorizationService.getDeviceCode()
    : {};

  const recentlyWatched = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)
    ? await UserService.getRecentlyWatched()
    : undefined;

  const parsedMovies = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)
    ? parseVodUserContentData({
        data: {
          railTitle: t(TRANSLATIONS.CONTINUE_WATCHING),
          railType: RAIL_TYPES.CONTINUE_WATCHING,
          entry: recentlyWatched.data.recently_watched,
        },
        itemsPerRow:
          recentlyWatched.data.recently_watched && recentlyWatched.data.recently_watched.length
            ? recentlyWatched.data.recently_watched.length
            : 0,
      })
    : undefined;

  const favorites = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)
    ? await UserService.getFavorites()
    : undefined;

  const parsedFavorites = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)
    ? parseVodUserContentData({
        data: {
          railTitle: t(TRANSLATIONS.FAVORITES),
          railType: RAIL_TYPES.FAVORITES,
          entry: favorites.data.favorites,
        },
        itemsPerRow:
          favorites.data.favorites && favorites.data.favorites.length
            ? favorites.data.favorites.length
            : 0,
      })
    : undefined;

  const deviceCode = response && response.data ? response.data.device_code : '';
  const verificationUri = response && response.data ? response.data.verification_uri_complete : '';

  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
    await AuthorizationService.setDeviceCodeStatusInterval(deviceCode);
  }

  page.props = {
    deviceCode,
    verificationUri,
    recentlyWatched,
    favorites,
    parsedMovies,
    parsedFavorites,
  };
}

import { LanguageService, t, AuthorizationService, UserService } from '../../../Services';
import { LOCAL_STORAGE_KEYS, TRANSLATIONS } from '../../../constants/globalConstants';
import { parseVodUserContentData } from '../../../Models';

export default async function (page) {
  AuthorizationService.clearPollingInterval();

  const languages = await LanguageService.getLanguages();

  !localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
  const response = await AuthorizationService.getDeviceCode();

  const recentlyWatched = await UserService.getRecentlyWatched();

  const parsedMovies = parseVodUserContentData({
    data: {
      railTitle: t(TRANSLATIONS.CONTINUE_WATCHING),
      entry: recentlyWatched.data.recently_watched,
    },
    itemsPerRow:
      recentlyWatched.data.recently_watched && recentlyWatched.data.recently_watched.length
        ? recentlyWatched.data.recently_watched.length
        : 0,
  });

  const favorites = await UserService.getFavorites();

  const parsedFavorites = parseVodUserContentData({
    data: {
      railTitle: t(TRANSLATIONS.FAVORITES),
      entry: favorites.data.favorites,
    },
    itemsPerRow:
      favorites.data.favorites && favorites.data.favorites.length
        ? favorites.data.favorites.length
        : 0,
  });

  const deviceCode = response.data.device_code;

  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
    await AuthorizationService.setDeviceCodeStatusInterval(deviceCode);
  }

  page.props = {
    languagesData: languages.data,
    deviceCode,
    verificationUri: response.data.verification_uri,
    recentlyWatched,
    favorites,
    parsedMovies,
    parsedFavorites,
  };
}

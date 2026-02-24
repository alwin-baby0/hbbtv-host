import { LOCAL_STORAGE_KEYS, RAIL_TYPES, TRANSLATIONS } from '../../../constants/globalConstants';
import { parseHomePageRailData } from '../../../Models';
import { HomePageService, t, UserService } from '../../../Services';

async function checkImageVisibility(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      resolve(true);
    };

    img.onerror = () => {
      resolve(false);
    };
  });
}

export default async function (page) {
  if (page._props.sliderData !== null && page._props.railData) {
    return;
  }

  await HomePageService.initialFetch();

  const recentlyWatched = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)
    ? await UserService.getRecentlyWatched()
    : undefined;

  const parsedMovies = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)
    ? parseHomePageRailData({
        data: {
          railType: RAIL_TYPES.CONTINUE_WATCHING,
          entry: {
            items: recentlyWatched.data.recently_watched,
            hasMore: recentlyWatched.data.total > HomePageService.currentRailLimit,
            name: t(TRANSLATIONS.CONTINUE_WATCHING),
            poster_format: 'landscape',
          },
        },
      })
    : undefined;

  const isBannerImageExist = await checkImageVisibility(
    HomePageService.banner // ovo je undefined
  );

  const modifiedRailData = [
    HomePageService.stripes[0],
    ...(isBannerImageExist ? [HomePageService.banner] : []),
    parsedMovies,
    ...HomePageService.stripes.slice(1),
  ];

  page.props = {
    sliderData: HomePageService.heroSectionItems,
    railData: modifiedRailData,
  };
}

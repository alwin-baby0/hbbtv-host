import { Router } from "@lightningjs/sdk";
import CategoryPickerItem from "../../../components/CategoryPickerItem/CategoryPickerItem";
import HorizontalContainer from "../../../components/HorizontalContainer/HorizontalContainer";
import PosterRailItem from "../../../components/RailItems/PosterRailItem";
import { imageSizes } from "../../../api/models/utils";
import { CARD_SIZES } from "../../../components/RailItems/constants";

export const VOD_TYPES = {
  MOVIE: 'movies',
  SERIES: 'series',
  SPORT: 'sports',
  SPORT_LIVE: 'sport_live',
  EPISODE: 'episode',
}

const mapVodTypeToNavigationUrl = (vodType) => {
  switch (vodType) {
    case VOD_TYPES.MOVIE: return 'movie';
    case VOD_TYPES.SERIES: return 'series';
    case VOD_TYPES.SPORT: return 'sports';
    case VOD_TYPES.EPISODE: return 'episode';
    default: return '';
  }
}

export const constructCategoryItems = (categories, vodType) =>
  categories.map((item) => ({
    type: CategoryPickerItem,
    props: {
      itemInfo: item,
      navigateTo: `filterPage/${item.id}/${mapVodTypeToNavigationUrl(vodType)}`,
      w: 170,
      h: 64,
      radius: 30,
      strokeWidth: 6,
    },
  }));

export const constructRails = (rails, options = {
  railItemType: VOD_TYPES.MOVIE,
  railOptions: {},
}) => {
  const { railItemType, railOptions, ...rest } = options;
  return rails.map((rail) => {
    return {
      type: HorizontalContainer,
      h: CARD_SIZES.POSTER.height,
      w: 1760,
      h: 485,
      itemSpacing: 52,
      ...rest,
      props: {
        items: railItemConstructor(rail, railItemType, railOptions)
      },
    };
  });
}

const railItemConstructor = (rail, railItemType, railOptions) => {
  switch (railItemType) {
    case VOD_TYPES.MOVIE:
    case VOD_TYPES.SERIES:
    case VOD_TYPES.SPORT:
      return constructSimpleRailItem(
        rail,
        mapVodTypeToNavigationUrl(railItemType),
        railOptions
      )
    case VOD_TYPES.SPORT_LIVE:
      return constructSportsLiveRailItem(rail, `url`, railOptions)
  }
}

const constructSimpleRailItem = (rail, urlNavigateRoute) =>
  rail.map((railItem) => {
    return {
      w: 270,
      type: PosterRailItem,
      flexItem: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
      },
      props: {
        itemTitle: railItem.title,
        imageSrc: railItem.getPortraitPoster(imageSizes.S).src,
        callback: () => {
          Router.navigate(`${urlNavigateRoute}-details/${railItem.id}`);
        },
      },
    };
  })

const constructSportsLiveRailItem = (rail, url) => {
  return null;
}

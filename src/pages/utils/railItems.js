import { Router } from '@lightningjs/sdk';
import LiveChannelRailItem from '../../components/RailItems/LiveChannelRailItem';
import {
  RAIL_TYPES,
  VIDEO_TYPES,
  CATEGORY_TYPES,
  ROUTES,
  IMAGE_SIZES,
} from '../../constants/globalConstants';
import LandscapeRailItem from '../../components/RailItems/LandscapeRailItem';
import PosterRailItem from '../../components/RailItems/PosterRailItem';
import SportsEventsRailItem from '../../components/RailItems/SportsEventsRailItem';
import CategoryPickerItem from '../../components/CategoryPickerItem/CategoryPickerItem';
import EPGRailItems from '../../components/RailItems/EPGRailItems';
import HeroRailItem from '../../components/RailItems/HeroRailItems';
import CollectionRailItem from '../../components/RailItems/CollectionRailItem';
import BannerRailItem from '../../components/RailItems/BannerRailItem';
import { DetailService, EPGService } from '../../Services';
import ContinueWatchingRailItem from '../../components/RailItems/ContinueWatchingRailItem';

export const railItemConstructor = (railItems, railType, railItemsOptions) => {
  switch (railType) {
    case RAIL_TYPES.MOVIE:
    case RAIL_TYPES.SERIE:
    case RAIL_TYPES.SPORT:
    case RAIL_TYPES.SEARCH:
      return constructSimpleRailItems(railItems, railItemsOptions);
    case RAIL_TYPES.EPISODE:
      return constructEpisodeRailItems(railItems, railItemsOptions);
    case RAIL_TYPES.SPORT_LIVE:
      return constructSportsLiveRailItems(railItems, railItemsOptions);
    case RAIL_TYPES.LIVETV:
      return constructLiveChannelRailItems(railItems, railItemsOptions);
    case RAIL_TYPES.CATEGORY:
      return constructCategoryItems(railItems, railItemsOptions);
    case RAIL_TYPES.EPGS:
      return constructEPGS(railItems, railItemsOptions);
    case RAIL_TYPES.HERO:
      return constructHeroRailItems(railItems, railItemsOptions);
    case RAIL_TYPES.COLLECTION:
      return constructLandscapeRailItems(railItems, railItemsOptions);
    case RAIL_TYPES.BANNER:
      return constructBannerRailItems(railItems, railItemsOptions);
    case RAIL_TYPES.CONTINUE_WATCHING:
      return constructContinueWatchingRailItems(railItems, railItemsOptions, true);
    case RAIL_TYPES.FAVORITES:
      return constructContinueWatchingRailItems(railItems, railItemsOptions);
    default: {
      console.warn('unknown rail type:', railType, ', defaulting to simple rail items');
      return constructSimpleRailItems(railItems, railItemsOptions);
    }
  }
};

const constructSimpleRailItems = (railItems, railItemsOptions) => {
  return railItems.map((railItem, index) => ({
    type: PosterRailItem,
    collision: true,
    w: 270,
    flexItem: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    ...railItemsOptions,
    props: {
      itemTitle: railItem.title ? railItem.title : '',
      imageSrc: railItem.getPortraitPoster(IMAGE_SIZES.S).src,
      itemType: railItem.type,
      index: index,
      callback: () => {
        Router.navigate(railItem.url);
      },
    },
  }));
};

const constructLandscapeRailItems = (railItems, railItemsOptions) => {
  return railItems.map((railItem, index) => ({
    type: CollectionRailItem,
    collision: true,
    w: 420,
    flexItem: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    ...railItemsOptions,
    props: {
      itemTitle: railItem.title ? railItem.title : '',
      imageSrc: railItem.getLandscapePoster(IMAGE_SIZES.S).src,
      itemType: railItem.type,
      index,
      callback: () => {
        Router.navigate(railItem.url);
      },
    },
  }));
};

const constructEPGS = (railItems, railItemsOptions) => {
  let items = [];

  items.push(
    ...railItems.map((railItem, index) => {
      const year = new Date(railItem.startTime).getFullYear();
      const width = year < 2023 ? 12000 : railItem.getDuration() * 8.33;

      return {
        collision: true,
        type: EPGRailItems,
        w: width,
        h: 95,
        ...railItemsOptions,
        props: {
          ...railItem,
          index,
        },
      };
    })
  );

  return items;
};

const constructHeroRailItems = (railItems, railItemsOptions) => {
  return railItems.map((railItem, index) => {
    return {
      type: HeroRailItem,
      collision: true,
      flexItem: {
        marginLeft: 15,
        marginRight: 15,
      },
      ...railItemsOptions,
      props: {
        index,
        imageSrc: railItem.getLandscapePoster(IMAGE_SIZES.S).src,
        callback: async () => {
          switch (railItem.type.value) {
            case CATEGORY_TYPES.MOVIE: {
              Router.navigate(`${ROUTES.MOVIE_DETAILS}/${railItem.id}`);
              break;
            }
            case CATEGORY_TYPES.SERIE: {
              Router.navigate(`${ROUTES.SERIES_DETAILS}/${railItem.id}`);
              break;
            }
            case CATEGORY_TYPES.EVENT: {
              Router.navigate(`${ROUTES.EVENT_DETAILS}/${railItem.id}`);
              break;
            }
            case CATEGORY_TYPES.VIDEO: {
              Router.navigate(ROUTES.PLAYER, {
                videoUrl: railItem.url,
                duration: railItem.duration,
              });
              break;
            }
            case CATEGORY_TYPES.COLLECTION: {
              Router.navigate(`${ROUTES.COLLECTION}/${railItem.id}`);
              break;
            }
            case CATEGORY_TYPES.LIVESTREAM: {
              const epgProgram = await EPGService.getSingleEPGChannel(`channel_${railItem.id}`);
              const epgStreamSrc = epgProgram.items[0].content.src;

              Router.navigate(ROUTES.PLAYER, {
                videoUrl: epgStreamSrc,
                duration: 0,
                videoType: VIDEO_TYPES.STREAM_NOW,
              });
              break;
            }
            default:
              console.warn('unknown category type:', railItem.type);
          }
        },
        url: railItem.trailerUrl,
      },
    };
  });
};

const constructEpisodeRailItems = (railItems, railItemsOptions) => {
  return railItems.map((railItem, index) => ({
    type: LandscapeRailItem,
    collision: true,
    flexItem: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    ...railItemsOptions,
    props: {
      itemTitle: railItem.title,
      itemSummary: railItem.summary,
      itemDescription: railItem.description,
      durationString: railItem.durationString,
      year: railItem.year,
      imageSrc: railItem.getThumbnailImage(IMAGE_SIZES.M).src,
      index,
      callback: () => {
        DetailService.getAdCues(railItem.id, railItem.seriesId, railItem.videoUrl).then(
          ({ data: result }) => {
            Router.navigate(ROUTES.PLAYER, {
              videoUrl: result[0]?.content.src ?? railItem.src,
              videoId: railItem.id,
              duration: railItem.duration,
              videoType: VIDEO_TYPES.SERIES,
              seriesID: railItem.seriesId,
              ssai: result[0].extensions.ssai ?? railItem.ssai,
              episodeTitle: railItem.title,
            });
          }
        );
      },
    },
  }));
};

const constructSportsLiveRailItems = (railItems, railItemsOptions) =>
  railItems.map((railItem, index) => ({
    w: 350,
    type: SportsEventsRailItem,
    collision: true,
    flexItem: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    ...railItemsOptions,
    props: {
      itemTitle: railItem.title,
      itemDescription: railItem.description,
      itemDateWithTime: railItem.dateWithTime,
      imageSrc: railItem.getLandscapePoster().src,
      radius: 9,
      strokeWidth: 4,
      index,
      callback: () => {
        Router.navigate(railItem.url);
      },
      ...railItemsOptions.props,
    },
  }));

// LIVETV
const constructLiveChannelRailItems = (railItems, railItemsOptions) =>
  railItems.map((railItem) => {
    return {
      w: 260,
      h: 100,
      type: LiveChannelRailItem,
      flexItem: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
      },
      channelInfo: railItem,
      ...railItemsOptions,
      props: {
        itemTitle: railItem.title,
        itemDescription: railItem.description,
        itemDateWithTime: railItem.dateWithTime,
        imageSrc: railItem.getLandscapePoster().src,
        radius: 9,
        strokeWidth: 4,
      },
    };
  });

const constructCategoryItems = (railItems, railItemsOptions) => {
  return railItems.map((railItem, index) => {
    return {
      type: CategoryPickerItem,
      flexItem: {
        marginLeft: 7,
        marginRight: 7,
      },
      collision: true,
      ...railItemsOptions,
      props: {
        itemInfo: railItem,
        callback: railItem.navigateToLink,
        w: 195,
        h: 55,
        radius: 10,
        strokeWidth: 2,
        index: index,
      },
    };
  });
};

// Banner
const constructBannerRailItems = (railItems, railItemsOptions) => {
  return railItems.map((railItem) => ({
    type: BannerRailItem,
    w: 1760,
    flexItem: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    ...railItemsOptions,
    props: {
      itemTitle: railItem.title ? railItem.title : '',
      imageSrc: railItem.getCtvPoster(1080),
      itemType: railItem.type,
      callback: () => {},
    },
  }));
};

const constructContinueWatchingRailItems = (
  railItems,
  railItemsOptions,
  enableProgressBar = false
) => {
  return railItems.map((railItem, index) => ({
    type: ContinueWatchingRailItem,
    collision: true,
    flexItem: {
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    ...railItemsOptions,
    props: {
      itemTitle: railItem.title ? railItem.title : '',
      imageSrc: railItem.getLandscapePoster(IMAGE_SIZES.S).src,
      itemType: railItem.type,
      index: index,
      enableProgressBar,
      callback: () => {
        Router.navigate(railItem.url);
      },
    },
  }));
};

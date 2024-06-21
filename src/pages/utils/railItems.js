import { Router } from '@lightningjs/sdk';
import { VOD_TYPES } from '.';
import { imageSizes } from '../../api/models/utils';
import LandscapeRailItem from '../../components/RailItems/LandscapeRailItem';
import PosterRailItem from '../../components/RailItems/PosterRailItem';
import SportsEventsRailItem from '../../components/RailItems/SportsEventsRailItem';

export const railItemConstructor = (railItems, railType, railItemsOptions) => {
  switch (railType) {
    case VOD_TYPES.MOVIE:
    case VOD_TYPES.SERIE:
    case VOD_TYPES.SPORT:
    case VOD_TYPES.SEARCH:
      return constructSimpleRailItems(railItems, railItemsOptions);
    case VOD_TYPES.EPISODE:
      return constructEpisodeRailItems(railItems, railItemsOptions);
    case VOD_TYPES.SPORT_LIVE:
      return constructSportsLiveRailItems(railItems, railItemsOptions);
    default: {
      console.warn('unknown rail type:', railType, ', defaulting to simple rail items');
      return constructSimpleRailItems(railItems, railItemsOptions);
    }
  }
};

const constructSimpleRailItems = (railItems, railItemsOptions) => {
  return railItems.map((railItem) => ({
    type: PosterRailItem,
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
      imageSrc: railItem.getPortraitPoster(imageSizes.S).src,
      itemType: railItem.type,
      callback: () => {
        Router.navigate(railItem.url);
      },
    },
  }));
};
const constructEpisodeRailItems = (railItems, railItemsOptions) =>
  railItems.map((railItem) => {
    return {
      type: LandscapeRailItem,
      flexItem: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 10,
      },
      ...railItemsOptions,
      props: {
        itemTitle: railItem.title,
        itemDescription: railItem.summary,
        imageSrc: railItem.getThumbnailImage(imageSizes.M).src,
        callback: () => {
          Router.navigate('player', {
            videoUrl: railItem.url,
            duration: railItem.duration,
          });
        },
      },
    };
  });

const constructSportsLiveRailItems = (railItems, railItemsOptions) =>
  railItems.map((railItem) => {
    return {
      w: 260,
      type: SportsEventsRailItem,
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
        callback: () => {
          Router.navigate(railItem.url);
        },
      },
    };
  });

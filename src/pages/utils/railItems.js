import { Router } from '@lightningjs/sdk';
import { RAIL_TYPES } from '.';
import { imageSizes } from '../../Models/utils';
import LandscapeRailItem from '../../Components/RailItems/LandscapeRailItem';
import PosterRailItem from '../../Components/RailItems/PosterRailItem';
import SportsEventsRailItem from '../../Components/RailItems/SportsEventsRailItem';
import CategoryPickerItem from '../../Components/CategoryPickerItem/CategoryPickerItem';

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
    case RAIL_TYPES.CATEGORY:
      return constructCategoryItems(railItems, railItemsOptions)
    default: {
      console.warn('unknown rail type:', railType, ', defaulting to simple rail items');
      return constructSimpleRailItems(railItems, railItemsOptions);
    }
  }
};

const constructSimpleRailItems = (railItems, railItemsOptions) =>
  railItems.map((railItem) => ({
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


const constructEpisodeRailItems = (railItems, railItemsOptions) =>
  railItems.map((railItem) => ({
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
  }));

const constructSportsLiveRailItems = (railItems, railItemsOptions) =>
  railItems.map((railItem) => ({
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
  }));

const constructCategoryItems = (railItems, railItemsOptions) =>
  railItems.map((railItem) => ({
    type: CategoryPickerItem,
    ...railItemsOptions,
    props: {
      itemInfo: railItem,
      callback: railItem.navigateToLink,
      w: 170,
      h: 64,
      radius: 30,
      strokeWidth: 6,
    },
  }));

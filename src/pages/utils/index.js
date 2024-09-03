import { CARD_SIZES } from '../../Components/RailItems/constants';
import { railItemConstructor } from './railItems';
import HorizontalContainer from '../../Components/HorizontalContainer/HorizontalContainer';
import { EPGService } from '../../Services';

export const VOD_PREVIEW_TYPES = {
  MOVIES: 'movies',
  SERIES: 'series',
  SPORTS: 'sports',
};

export const RAIL_TYPES = {
  MOVIE: 'movie',
  SERIE: 'serie',
  SPORT: 'sport',
  SPORT_LIVE: 'sport_live',
  EPISODE: 'episode',
  SEARCH: 'search',
  CATEGORY: 'category',
  LIVETV: 'live',
  EPGS: 'epg-channel-programs',
  HERO: 'HeroRails',
};
const RAIL_WIDTHS = {
  [RAIL_TYPES.MOVIE]: 1760,
  [RAIL_TYPES.SERIE]: 1760,
  [RAIL_TYPES.SPORT]: 1760,
  [RAIL_TYPES.SPORT_LIVE]: 1760,
  [RAIL_TYPES.EPISODE]: 1760,
  [RAIL_TYPES.SEARCH]: 1760,
  [RAIL_TYPES.CATEGORY]: 1740,
  [RAIL_TYPES.LIVETV]: 100,
  [RAIL_TYPES.EPGS]: 1615,
  [RAIL_TYPES.SEARCH]: 1760,
};

export const constructRails = (rails) => {
  // Ensure rails is an array
  if (!Array.isArray(rails)) {
    return constructRails([rails]);
  }

  return rails
    .filter((rail) => !!rail)
    .map((rail) => {
      // const { items, itemsPerRow } = rail;
      const items = rail.items;
      const itemsPerRow = rail.itemsPerRow;

      if (itemsPerRow && items.length - 1 >= itemsPerRow) {
        const chunkedItems = chunkArray(items, itemsPerRow); // chunk the items into rows

        return chunkedItems.map((chunkedRailItem, index) => {
          const newRail = { ...rail };
          newRail.railTitle = index === 0 ? rail.railTitle : '';
          newRail.items = chunkedRailItem;
          return cronstructSingleLineRail(newRail);
        });
      }
      return cronstructSingleLineRail(rail);
    });
};

export const cronstructSingleLineRail = (rail) => {
  const { items, railType, cardType = 'POSTER', railTitle, railItemsOptions, ...rest } = rail;
  const containerDimensions =
    railType === RAIL_TYPES.LIVETV
      ? { h: 100, w: 100 }
      : { h: CARD_SIZES[cardType]?.height || 500, w: RAIL_WIDTHS[railType] || 1500 };

  let paddingLeft = 0;
  let targetItem = null;
  let targetIndex = null;
  if (railType === RAIL_TYPES.EPGS) {
    const epgStartTime = EPGService.startTime;
    const itemStartTime = items[0]?.startTime;

    const now = new Date().getTime();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemStartTime = item.startTime;
      const itemEndTime = item.endTime;

      if (itemStartTime <= now && now <= itemEndTime) {
        targetItem = item;
        targetIndex = i;
        break;
      }
    }

    if (itemStartTime != null) {
      const timeDifferenceMinutes = (epgStartTime - itemStartTime) / (1000 * 60);
      paddingLeft = -timeDifferenceMinutes * 8.33;
    } else {
      console.error('items[0].startTime is undefined or null');
    }
  }
  return {
    type: HorizontalContainer,
    ...rest,
    ...containerDimensions,
    props: {
      h: CARD_SIZES[cardType]?.height, // todo: remove 50
      w: containerDimensions.w,
      railTitle: railTitle,
      cardType: cardType,
      items: railItemConstructor(items, railType, railItemsOptions),
      paddingLeft,
      targetIndex: targetIndex,
    },
  };
};

const chunkArray = (array, size) => {
  if (!Array.isArray(array) || size <= 0) {
    return;
  }

  return array.reduce((acc, _, index) => {
    if (index % size === 0) {
      acc.push(array.slice(index, index + size));
    }
    return acc;
  }, []);
};

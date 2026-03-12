import { railItemConstructor } from './railItems';
import HorizontalContainer from '../../components/HorizontalContainer/HorizontalContainer';
import { EPGService } from '../../Services';
import Empty from '../LiveTV/components/Empty';
import { CARD_TYPES, RAIL_TYPES, CARD_SIZES, ROUTES } from '../../constants/globalConstants';

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
  [RAIL_TYPES.COLLECTION]: 1760,
  [RAIL_TYPES.USER_CONTENT]: 1400,
  [RAIL_TYPES.BANNER]: 1760,
};

let globalVerticalIndex = 0;

export const constructRails = (rails) => {
  // Ensure rails is an array
  if (!Array.isArray(rails)) {
    return constructRails([rails]);
  }

  return rails
    .filter((rail) => !!rail)
    .map((rail, index) => {
      const items = rail.items;
      const itemsPerRow = rail.itemsPerRow;

      window.addEventListener('verticalIndexReset', verticalIndexReset);

      if (itemsPerRow && items.length - 1 >= itemsPerRow) {
        const chunkedItems = chunkArray(items, itemsPerRow); // chunk the items into rows

        return chunkedItems.map((chunkedRailItem) => {
          const newRail = { ...rail };
          newRail.railTitle = globalVerticalIndex === 0 ? rail.railTitle : '';
          newRail.items = chunkedRailItem;

          const currentIndex = globalVerticalIndex;
          globalVerticalIndex += 1;

          return cronstructSingleLineRail(newRail, currentIndex);
        });
      }
      return cronstructSingleLineRail(rail, index); //-1 is placeholder value if items are not chunked
    });
};

const verticalIndexReset = () => {
  console.warn('verticalIndexReset');
  globalVerticalIndex = 0;
};

export const cronstructSingleLineRail = (rail, index) => {
  const {
    items,
    railType,
    cardType = CARD_TYPES.POSTER,
    railTitle,
    railItemsOptions,
    ...rest
  } = rail;

  let paddingLeft = 0;
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

  const containerDimensions =
    railType === RAIL_TYPES.LIVETV
      ? { h: 100, w: 100 }
      : {
          h:
            items && items.length && items[0].orientation
              ? items[0].orientation === 'landscape'
                ? CARD_SIZES[cardType]?.landscape_height
                : CARD_SIZES[cardType]?.poster_height
              : CARD_SIZES[cardType]?.height || 500,
          w: RAIL_WIDTHS[railType] || 1500,
        };

  return {
    type: HorizontalContainer,
    ...(railType !== RAIL_TYPES.BANNER && { collision: true }),
    ...rest,
    ...containerDimensions,
    ...((railType === RAIL_TYPES.EPGS || index === 0) && { collision: true }),
    index,
    props: {
      h:
        items && items.length && items[0].orientation
          ? items[0].orientation === 'landscape'
            ? CARD_SIZES[cardType]?.landscape_height
            : CARD_SIZES[cardType]?.poster_height
          : CARD_SIZES[cardType]?.height,
      w:
        ((items && items.length && items[0].orientation
          ? items[0].orientation === 'landscape'
            ? CARD_SIZES[cardType]?.landscape_width
            : CARD_SIZES[cardType]?.poster_width
          : CARD_SIZES[cardType]?.width) +
          20) *
        items.length,
      railWidth: RAIL_WIDTHS[railType] || 1500,
      railTitle: railTitle,
      railType,
      cardType: items[0].type === RAIL_TYPES.BANNER ? CARD_TYPES.BANNER : cardType,
      ...((railType === RAIL_TYPES.EPGS ||
        railType === RAIL_TYPES.CONTINUE_WATCHING ||
        railType === RAIL_TYPES.FAVORITES) && { wrap: true }),
      items: railItemConstructor(
        items.length === 0 ? [{ type: Empty }] : items,
        railType,
        railItemsOptions,
        cardType
      ),
      paddingLeft,
      targetIndex: targetIndex,
      index: index,
      ...(rail.page && { page: rail.page }),
      ...(rail.seasonId && { seasonId: rail.seasonId }),
      ...(rail.seriesId && { seriesId: rail.seriesId }),
    },
  };
};

export const chunkArray = (array, size) => {
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

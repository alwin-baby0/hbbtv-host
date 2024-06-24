import { CARD_SIZES } from '../../Components/RailItems/constants';
import { railItemConstructor } from './railItems';
import HorizontalContainer from '../../Components/HorizontalContainer/HorizontalContainer';

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
};

export const constructRails = (rails) => {
  // Ensure rails is an array
  if (!Array.isArray(rails)) {
    return constructRails([rails]);
  }

  return rails
    .filter((rail) => rail) // Remove any undefined/null rails
    .map((rail) => {
      const { items, itemsPerRow } = rail;

      if (itemsPerRow && items.length - 1 >= itemsPerRow) {
        const chunkedItems = chunkArray(items, itemsPerRow); // chunk the items into rows

        return chunkedItems.map((chunkedRailItem, index) => {
          return cronstructSingleLineRail({
            ...rail,
            railTitle: index === 0 ? rail.railTitle : '', // leave title only for first row
            items: chunkedRailItem, // each line has its items
          });
        });
      }

      return cronstructSingleLineRail(rail);
    })
    .flat() // Flatten the array of arrays if chunking occurred
    .filter(Boolean); // Remove null/undefined values
};

const cronstructSingleLineRail = (rail) => {
  const { items, railType, cardType, railTitle, railItemsOptions, ...rest } = rail;

  return {
    type: HorizontalContainer,
    h: CARD_SIZES[cardType]?.height + 50,
    w: 1760,
    ...rest,
    props: {
      h: CARD_SIZES[cardType]?.height + 50,
      railTitle: railTitle,
      items: railItemConstructor(items, railType, railItemsOptions),
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

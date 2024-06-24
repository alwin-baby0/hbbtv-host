import { Router } from '@lightningjs/sdk';
import { getSearch } from '../../../api/search';
import HorizontalContainer from '../../../Components/HorizontalContainer/HorizontalContainer';
import PosterRailItem from '../../../Components/RailItems/PosterRailItem';
import { imageSizes } from '../../../Models/utils';

const FILTER_TYPES = {
  MOVIE: 'movie',
  SERIES: 'series',
};

const filtered = {
  items: [],
  title: '',
  type: '',
  category: '',
  timestamp: 0,
};

const getGenresInfo = async (page, props) => {
  const ROW_SIZE = 6;

  const category = props.action;
  const type = props.genre_movies;

  let searchType;
  if (type === FILTER_TYPES.MOVIE) {
    searchType = 'movie';
  } else if (type === FILTER_TYPES.SERIES) {
    searchType = 'series';
  } else {
    searchType = 'unknown';
  }

  if (
    filtered.timestamp + 1000 * 60 * 30 <= new Date().getTime() ||
    filtered.category !== category ||
    filtered.type !== type
  ) {
    const { items: row } = await getSearch(category, type);

    filtered.type = type;
    filtered.category = category;
    filtered.timestamp = new Date().getTime();

    const rows = [];
    if (row.length > 0) {
      for (let i = 0; i < row.length; i += ROW_SIZE) {
        rows.push({ items: row.slice(i, i + ROW_SIZE) });
      }

      const items = rows.map((row) => {
        return {
          type: HorizontalContainer,
          h: 500,
          w: 1760,
          itemSpacing: 520,
          props: {
            items: row.items.map((item) => ({
              type: PosterRailItem,
              flexItem: {
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
                marginBottom: 10,
              },
              props: {
                itemTitle: item.title,
                imageSrc: item.getPortraitPoster(imageSizes.S).src,
                callback: () => {
                  Router.navigate(`${searchType}-details/${item.id}`);
                },
              },
            })),
          },
        };
      });

      filtered.title = '';
      filtered.items = items;
    } else {
      filtered.items = [];
      filtered.title = 'NOTHING';
    }

    page._Title.text = filtered.title;
    page._Column.props = {
      items: filtered.items,
    };
  }
};
export default async function (page, props) {
  await getGenresInfo(page, props);
}

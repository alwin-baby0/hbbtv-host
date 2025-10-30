import { Router } from '@lightningjs/sdk';
import HorizontalContainer from '../../../components/HorizontalContainer/HorizontalContainer';
import PosterRailItem from '../../../components/RailItems/PosterRailItem';
import { IMAGE_SIZES, FILTER_TYPES } from '../../../constants/globalConstants';
import { SearchService } from '../../../Services';

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
  const title = props?.title?.toUpperCase();
  let searchType;
  if (type === FILTER_TYPES.MOVIE) {
    searchType = FILTER_TYPES.MOVIE;
  } else if (type === FILTER_TYPES.SERIES) {
    searchType = FILTER_TYPES.SERIES;
  } else {
    searchType = 'unknown';
  }

  if (
    filtered.timestamp + 1000 * 60 * 30 <= new Date().getTime() ||
    filtered.category !== category ||
    filtered.type !== type
  ) {
    const { items: row } = await SearchService.getSearch(category, type);

    filtered.type = type;
    filtered.category = category;
    filtered.timestamp = new Date().getTime();
    const rows = [];
    if (row.length > 0) {
      for (let i = 0; i < row.length; i += ROW_SIZE) {
        rows.push({ items: row.slice(i, i + ROW_SIZE) });
      }

      const items = rows.map((row, index) => {
        return {
          type: HorizontalContainer,
          collision: true,
          h: 460,
          w: 1760,
          itemSpacing: 520,
          props: {
            items: row.items.map((item, index) => ({
              type: PosterRailItem,
              collision: true,
              flexItem: {
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
                marginBottom: 10,
              },
              props: {
                itemTitle: item.title,
                imageSrc: item.getPortraitPoster(IMAGE_SIZES.S).src,
                callback: () => {
                  Router.navigate(`${searchType}-details/${item.id}`);
                },
                index,
              },
            })),
          },
        };
      });

      filtered.title = '';
      filtered.items = items;
    } else {
      filtered.items = [];
      filtered.title = `No ${searchType} found`;
    }

    page._Title.text = filtered.title;
    page._Title.patch({
      y: 200,
    });
    page._Column.props = {
      items: filtered.items,
      parentState: 'VodContainer',
    };

    page._VodContentContainer?.patch({
      collision: true,
      props: {
        itemInfo: { category },
        w: 170,
        h: 64,
        radius: 30,
        strokeWidth: 3,
        parentState: 'VodContentContainer',
      },
    });

    page._Genre.patch({
      text: { text: title },
    });
  }
};

export default async function (page, props) {
  await getGenresInfo(page, props);
}

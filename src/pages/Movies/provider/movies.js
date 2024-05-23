import { Row } from '@lightningjs/ui-components';
import { getGenres, getMovies } from '../../../api/movies';
import CategoryPickerItem from '../../../components/CategoryPickerItem/CategoryPickerItem';
import PosterRailItem from '../../../components/RailItems/PosterRailItem';
import MoviesRailItem from '../../../api/movies/MoviesRailItem';
import { Router } from '@lightningjs/sdk';

const fetchGenres = (page) => {
  return getGenres('movies', 'genre_movies').then(({ data }) => {
    page._Categories.props = {
      x: 110,
      y: 150,
      width: 1700,
      height: 64,
    };

    const items = data.entry.map((item) => {
      return {
        type: CategoryPickerItem,
        w: 171,
        props: {
          itemInfo: item,
          url: `filterPage/:${item.id}/:${item.type.value}`,
          w: 170,
          h: 64,
          radius: 30,
          strokeWidth: 6,
        },
      };
    });
    page._CaterogyItem.items = items;
  });
};

const fetchMovies = async (page) => {
  const ROW_SIZE = 6;
  const { items } = await getMovies();
  const flattenedVideos = items.flat();

  const rows = [];
  for (let i = 0; i < flattenedVideos.length; i += ROW_SIZE) {
    rows.push({ items: flattenedVideos.slice(i, i + ROW_SIZE) });
  }

  const mappedItems = rows.map((row) => {
    return {
      type: Row,
      h: 500,
      w: 1800,
      items: row.items.map((item) => {
        return {
          w: 270,
          type: PosterRailItem,
          props: {
            itemTitle: item.title,
            imageSrc: item.getPortraitPoster(MoviesRailItem.small).src,
            callback: () => {
              Router.navigate(`movie-details/${item.id}`);
            },
          },
        };
      }),
    };
  });

  page._Column.items = mappedItems;
};

export default async function (page) {
  await fetchGenres(page);
  await fetchMovies(page);
}

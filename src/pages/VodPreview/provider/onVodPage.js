import { getGenres, getMovies } from '../../../api/movies';
import CategoryPickerItem from '../../../components/CategoryPickerItem/CategoryPickerItem';
import PosterRailItem from '../../../components/RailItems/PosterRailItem';
import MoviesRailItem from '../../../api/movies/MoviesRailItem';
import { Router } from '@lightningjs/sdk';
import { VOD_TYPES } from '../utils';
import HorizontalContainer from '../../../components/HorizontalContainer/HorizontalContainer';
import { CARD_SIZES } from '../../../components/RailItems/constants';

const movies = {
  items: [],
  timestamp: 0,
};

const genres = {
  items: [],
  timestamp: 0,
};

const fetchGenres = async (page) => {
  if (genres.timestamp + 1000 * 60 * 30 <= new Date().getTime()) {
    const { data } = await getGenres('movies', 'genre_movies');
    let itemType;
    genres.items = data.entry.map((item) => {
      if (item.type.value === 'genre_movies') {
        itemType = 'movie';
      }

      return {
        type: CategoryPickerItem,
        props: {
          itemInfo: item,
          url: `filterPage/${item.id}/${itemType}`,
          w: 170,
          h: 64,
          radius: 30,
          strokeWidth: 6,
        },
      };
    });
  }

  page._Categories._CaterogyItems.props = {
    items: genres.items,
  };
};

const fetchMovies = async (page) => {
  if (movies.timestamp + 1000 * 60 * 30 <= new Date().getTime()) {
    const ROW_SIZE = 6;
    const { items } = await getMovies();
    const flattenedVideos = items.flat();

    const rows = [];
    for (let i = 0; i < flattenedVideos.length; i += ROW_SIZE) {
      rows.push({ items: flattenedVideos.slice(i, i + ROW_SIZE) });
    }

    movies.items = rows.map((row) => {
      return {
        type: HorizontalContainer,
        h: CARD_SIZES.POSTER.height,
        w: 1760,
        h: 485,
        itemSpacing: 52,
        props: {
          items: row.items.map((item) => {
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
                itemTitle: item.title,
                imageSrc: item.getPortraitPoster(MoviesRailItem.small).src,
                callback: () => {
                  Router.navigate(`movie-details/${item.id}`);
                },
              },
            };
          }),
        },
      };
    });

    movies.timestamp = new Date().getTime();
  }

  page._Column.props = {
    items: movies.items,
  };
};

export default async function (page, { vodType }) {
  switch (vodType) {
    case VOD_TYPES.MOVIE: {
      await fetchGenres(page);
      await fetchMovies(page);
      break;
    }
    case VOD_TYPES.SERIES: {
      await fetchGenres(page);
      await fetchMovies(page);
      break;
    }
    case VOD_TYPES.SPORT: {
      break;
    }
    default:
      Router.back();
  }
}

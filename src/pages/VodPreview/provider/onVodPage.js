import { Router } from '@lightningjs/sdk';
import { getGenres, getMovies } from '../../../api/movies';
import { getSeries } from '../../../api/series';
import { VOD_TYPES } from '../utils';
import { CARD_SIZES } from '../../../components/RailItems/constants';
import HorizontalContainer from '../../../components/HorizontalContainer/HorizontalContainer';
import CategoryPickerItem from '../../../components/CategoryPickerItem/CategoryPickerItem';
import PosterRailItem from '../../../components/RailItems/PosterRailItem';
import MoviesRailItem from '../../../api/movies/MoviesRailItem';
import SeriesRailItem from '../../../api/series/SeriesRailItem';

const movies = {
  items: [],
  timestamp: 0,
};

const genres = {
  items: [],
  type: '',
  timestamp: 0,
};

const series = {
  items: [],
  timestamp: 0,
};
const genresNames = {
  movies: 'movie',
  series: 'series',
};
const genresType = {
  movies: 'genres_movies',
  series: 'genres_series',
};
const fetchGenres = async (page, vodType) => {
  let genreType;
  if (genres.timestamp + 1000 * 60 * 30 <= new Date().getTime() || genres.type !== vodType) {
    const { data } = await getGenres(vodType, genresType[vodType]);

    if (vodType === 'movies') {
      genreType = 'movie';
    } else if (vodType === 'series') {
      genreType = 'series';
    } else if (vodType === 'sports') {
      genreType = 'sports';
    }

    genres.items = data.entry.map((item) => ({
      type: CategoryPickerItem,
      props: {
        itemInfo: item,
        url: `filterPage`,
        category: item.id,
        type: genreType,
        w: 170,
        h: 64,
        radius: 30,
        strokeWidth: 6,
      },
    }));

    genres.timestamp = new Date().getTime();
    genres.type = vodType;
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

const fetchSeries = async (page) => {
  if (series.timestamp + 1000 * 60 * 30 <= new Date().getTime()) {
    const ROW_SIZE = 6;
    const { items } = await getSeries(1, 6);
    const flattenedVideos = items.flat();

    const rows = [];
    for (let i = 0; i < flattenedVideos.length; i += ROW_SIZE) {
      rows.push({ items: flattenedVideos.slice(i, i + ROW_SIZE) });
    }

    series.items = rows.map((row) => {
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
                imageSrc: item.getPortraitPoster(SeriesRailItem.small).src,
                callback: () => {
                  Router.navigate(`series-details/${item.id}`);
                },
              },
            };
          }),
        },
      };
    });

    series.timestamp = new Date().getTime();
  }

  page._Column.props = {
    items: series.items,
  };
};

export default async function (page, { vodType }) {
  switch (vodType) {
    case VOD_TYPES.MOVIE: {
      await fetchGenres(page, vodType);
      await fetchMovies(page);
      break;
    }
    case VOD_TYPES.SERIES: {
      await fetchGenres(page, vodType);
      await fetchSeries(page);
      break;
    }
    case VOD_TYPES.SPORT: {
      break;
    }
    default:
      Router.back();
  }
}

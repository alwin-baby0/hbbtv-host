import { Router } from '@lightningjs/sdk';
import { getMovieGenres, getMovies } from '../../../api/movies';
import { getSeries, getSeriesGenres } from '../../../api/series';
import { VOD_TYPES, constructCategoryItems, constructRails } from '../utils';


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

const fetchGenres = async (page, vodType) => {
  if (genres.timestamp + 1000 * 60 * 30 <= new Date().getTime() || genres.type !== vodType) {
    page._Categories._CaterogyItems.props = {
      items: [],
    };

    const fetcher = vodType === 'movies' ? getMovieGenres : getSeriesGenres
    const { data: { entry } } = await fetcher();
    genres.items = constructCategoryItems(entry, vodType)

    genres.timestamp = new Date().getTime();
    genres.type = vodType;
  }

  page._Categories._CaterogyItems.props = {
    items: genres.items,
  };
};

const fetchMovies = async (page) => {
  if (movies.timestamp + 1000 * 60 * 30 <= new Date().getTime()) {
    page._Column.props = {
      items: [],
    };

    const ROW_SIZE = 6;
    const { items } = await getMovies();

    const flattenedVideos = items.flat();
    const rows = [];

    for (let i = 0; i < flattenedVideos.length; i += ROW_SIZE) {
      rows.push(flattenedVideos.slice(i, i + ROW_SIZE));
    }

    movies.items = constructRails(rows, { railItemType: VOD_TYPES.MOVIE });
    movies.timestamp = new Date().getTime();
  }

  page._Column.props = {
    items: movies.items,
  };
};

const fetchSeries = async (page) => {
  if (series.timestamp + 1000 * 60 * 30 <= new Date().getTime()) {
    page._Column.props = {
      items: [],
    };

    const ROW_SIZE = 6;
    const { items } = await getSeries();
    const flattenedVideos = items.flat();

    const rows = [];
    for (let i = 0; i < flattenedVideos.length; i += ROW_SIZE) {
      rows.push(flattenedVideos.slice(i, i + ROW_SIZE));
    }

    series.items = constructRails(rows, { railItemType: VOD_TYPES.SERIES })

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

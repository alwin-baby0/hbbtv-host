import { Router } from '@lightningjs/sdk';
import { getMovieGenres, getMovies } from '../../../api/movies';
import { getSeries, getSeriesGenres } from '../../../api/series';
import { getEvents, getSports } from '../../../api/sports';
import { VOD_PREVIEW_TYPES, VOD_TYPES, constructCategoryItems, constructRails } from '../../utils';
import { CONTENT_TYPE } from '../../../components/VodContentContainer/VodContentContainer';

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

const sports = {
  items: [],
  timestamp: 0,
};

const sportsEvents = {
  items: [],
  timestamp: 0,
};

const fetchGenres = async (vodType) => {
  if (genres.timestamp + 1000 * 60 * 30 <= new Date().getTime() || genres.type !== vodType) {
    const fetcher = vodType === 'movies' ? getMovieGenres : getSeriesGenres;
    const {
      data: { entry },
    } = await fetcher();

    genres.items = constructCategoryItems(entry, vodType);

    genres.timestamp = new Date().getTime();
    genres.type = vodType;
  }

  return {
    contentType: CONTENT_TYPE.CATEGORIES,
    categoryItems: genres.items,
  }
};

const fetchMovies = async () => {
  if (movies.timestamp + 1000 * 60 * 30 <= new Date().getTime()) {
    // trebalo bi da se napravi neki servis kao sto imamo za home da se fetchuje sa paginacijom
    const newMovies1 = await getMovies(1, 6);
    const newMovies2 = await getMovies(2, 6);
    const newMovies3 = await getMovies(3, 6);
    movies.items = constructRails([newMovies1, newMovies2, newMovies3], {
      railItemType: VOD_TYPES.MOVIE,
    });

    movies.timestamp = new Date().getTime();
  }

  return movies.items;
};

const fetchSeries = async () => {
  if (series.timestamp + 1000 * 60 * 30 <= new Date().getTime()) {
    const series1 = await getSeries(1, 6);
    const series2 = await getSeries(2, 6);
    const series3 = await getSeries(3, 6);

    series.items = constructRails([series1, series2, series3], { railItemType: VOD_TYPES.SERIES });
    series.timestamp = new Date().getTime();
  }

  return series.items;
};

const fetchSports = async (page) => {
  if (sports.timestamp + 1000 * 60 * 30 <= new Date().getTime()) {

    const sports1 = await getSports(1, 7);
    const sports2 = await getSports(2, 7);
    const sports3 = await getSports(3, 7);

    sports.items = constructRails([sports1, sports2, sports3]);
    sports.timestamp = new Date().getTime();
  }

  return sports.items;
};

const fetchSportsEvents = async (page) => {
  if (sportsEvents.timestamp + 1000 * 60 * 30 <= new Date().getTime()) {
    const event1 = await getEvents();

    sportsEvents.items = constructRails([event1]);

    sportsEvents.timestamp = new Date().getTime();
  }

  return {
    contentType: CONTENT_TYPE.EVENTS,
    eventItems: sportsEvents.items,
  }
};

export default async function (page, { vodType }) {
  let items;
  let content;

  switch (vodType) {
    case VOD_PREVIEW_TYPES.MOVIES: {
      content = await fetchGenres(vodType);
      items = await fetchMovies();
      break;
    }
    case VOD_PREVIEW_TYPES.SERIES: {
      content = await fetchGenres(vodType);
      items = await fetchSeries();
      break;
    }
    case VOD_PREVIEW_TYPES.SPORTS: {
      content = await fetchSportsEvents();
      items = await fetchSports();
      break;
    }
    default:
      Router.back();
  }

  page.props = { items, content, vodType };
}

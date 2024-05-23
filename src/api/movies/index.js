import request, { V1, V2 } from '../index';
import MoviesRailItem from './MoviesRailItem';
import SingleMovieRailItem from './SingleMovieRailItem';

export const getGenres = (category, type) => {
  return request({
    url: '/getGenres',
    apiVersion: V2,
    method: 'GET',
    params: {
      category,
      type,
    },
  });
};

export const getMovies = () =>
  request({
    url: '/search',
    apiVersion: V2,
    method: 'GET',
    params: {
      keyword: 'all',
      category: 'movie',
      orderBy: 'date:desc',
      limit: 24,
    },
  }).then(parseMoviesPageData);

function parseMoviesPageData(result) {
  const { data } = result;

  return {
    sectionTitle: data.title,
    items: data.entry?.map((item) => new MoviesRailItem(item)),
  };
}

export const getSingleMovie = (movieId) =>
  request({
    url: `/getMovie`,
    apiVersion: V2,
    method: 'GET',
    params: {
      id: movieId,
    },
  }).then(parseSingleMoviePageData);

function parseSingleMoviePageData(result) {
  const { data } = result;
  return new SingleMovieRailItem(data.entry[0]);
}

import request, { V1, V2 } from '../index';
import { MovieRailItem, SimpleRailItem } from '../models';

export const getMovieGenres = async () => {
  return request({
    url: '/getGenres',
    apiVersion: V2,
    method: 'GET',
    params: {
      category: 'movies',
      type: 'genres_movies',
    },
  });
};

export const getMovies = async () =>
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
    items: data.entry?.map((item) => new SimpleRailItem(item)),
  };
}

export const getSingleMovie = async (movieId) =>
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
  return new MovieRailItem(data.entry[0]);
}

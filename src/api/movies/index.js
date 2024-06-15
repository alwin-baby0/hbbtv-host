import { VOD_TYPES } from '../../pages/utils';
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

export const getMovies = async (page, limit) =>
  request({
    url: '/movies',
    apiVersion: V2,
    method: 'GET',
    params: {
      page: page,
      limit: limit,
    },
  }).then(parseMoviesPageData);

function parseMoviesPageData({ data }) {
  const railItems = data.entry?.map((item) => new SimpleRailItem(item))
  if (!railItems || railItems.length === 0) return;

  return {
    railType: VOD_TYPES.MOVIE,
    cardType: 'POSTER',
    items: railItems,
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

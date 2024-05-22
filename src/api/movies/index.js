import request, { V1, V2 } from '../index';

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

export const getMovies = () => {
  return request({
    url: '/movies',
    apiVersion: V2,
    method: 'GET',
  });
};

export const getSingleMovie = (movieId) => {
  return request({
    url: `/getMovie`,
    apiVersion: V2,
    method: 'GET',
    params: {
      id: movieId,
    },
  });
};

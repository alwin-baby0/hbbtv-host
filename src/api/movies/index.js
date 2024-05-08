import request, { axiosInstance, axiosInstance2 } from '../index';

export const getGenres = (category, type) => {
  if (category === undefined) {
    category === 'action';
  }
  if (type === undefined) {
    type === '';
  }

  return request({
    url: axiosInstance2.defaults.baseURL + '/getGenres',
    method: 'GET',
    params: {
      category,
      type,
    },
  });
};

export const getMovies = () => {
  return request({
    url: axiosInstance.defaults.baseURL + '/movies',
    method: 'GET',
  });
};

export const getSingleMovie = (movieId) => {
  return request({
    url: axiosInstance2.defaults.baseURL + `/getMovie`,
    method: 'GET',
    params: {
      id: movieId,
    },
  });
};

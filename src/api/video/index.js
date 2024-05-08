import request, { axiosInstance, axiosInstance2 } from '../index';

export const getVideo = (videoId) => {
  return request({
    url: axiosInstance.defaults.baseURL + '/video',
    method: 'GET',
    params: {
      video_id: videoId,
    },
  });
};

export const getVideoUrl = (videoId) => {
  return request({
    url: axiosInstance.defaults.baseURL + '/getVideoUrl',
    method: 'GET',
    params: {
      video_id: videoId,
    },
  });
};

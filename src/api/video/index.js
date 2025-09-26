import request, { V1 } from '../index';

export const getVideo = (videoId) => {
  return request({
    url: '/video',
    apiVersion: V1,
    method: 'GET',
    params: {
      video_id: videoId,
    },
  });
};

export const getVideoUrl = (videoId) => {
  return request({
    url: '/getVideoUrl',
    apiVersion: V1,
    method: 'GET',
    params: {
      video_id: videoId,
    },
  });
};

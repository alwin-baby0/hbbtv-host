import request, { axiosInstance, axiosInstance2 } from '../index';

export const getChannels = () =>
  request({
    url: axiosInstance.defaults.baseURL + `channels`,
    method: 'GET',
    params: {
      page: 1,
      limit: 6,
    },
  });

export const getSingleChannel = (channelId) =>
  request({
    url: axiosInstance.defaults.baseURL + `/getChannel`,
    method: 'GET',
    params: {
      channel_id: `${channelId}`,
    },
  });

export const getLiveChannels = (channelId) =>
  request({
    url: axiosInstance2.defaults.baseURL + `/getLiveChannel`,
    method: 'GET',
    params: {
      id: channelId,
    },
  });

export const getEPG = (channelId) =>
  request({
    url: axiosInstance2.defaults.baseURL + `/getEpg`,
    method: 'GET',
    params: {
      type: 'livechannel',
      id: channelId,
    },
  });
export const getEPGV2 = (channelId) =>
  request({
    url: axiosInstance2.defaults.baseURL + `/epg_program`,
    method: 'GET',
    params: {
      start_time: start_time,
      id: `channel_${channelId}`,
    },
  });

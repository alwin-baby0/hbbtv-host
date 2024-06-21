import request, { V2 } from '../index';
import { SimpleRailItem, GalleryRailItem } from '../models';

export const getHomePage = (row, page, limit) =>
  request({
    url: '/start',
    apiVersion: V2,
    method: 'GET',
    params: {
      row,
      page,
      limit,
    },
  }).then(parseHomePageRailData);

export const getHomePageHeroSection = () =>
  request({
    url: '/start',
    apiVersion: V2,
    method: 'GET',
    params: {
      row: 1,
      page: 1,
      limit: 6,
    },
  }).then(parseHomePageHeroSection);

function parseHomePageRailData({ data }) {
  return {
    sectionTitle: data.title,
    items: data.entry?.map((item) => new SimpleRailItem(item)),
  };
}

function parseHomePageHeroSection({ data }) {
  return {
    sectionTitle: data.title,
    items: data.entry?.map((item) => new GalleryRailItem(item)),
  };
}

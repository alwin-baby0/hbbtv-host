import { Category, SimpleRailItem, LiveEventsRailItem, GalleryItem } from './';
import { VODS_PER_ROW } from '../Services/VodSerivce';
import { RAIL_TYPES } from '../Pages/utils';

// Home page
export const parseHomePageRailData = ({ data }) => {
  const railItems = data.entry?.map((item) => new SimpleRailItem(item));
  if (!railItems || railItems.length === 0) return;

  return {
    railType: railItems[0].type,
    railTitle: data.title,
    cardType: 'POSTER',
    items: railItems,
  };
};

export const parseHomePageHeroSection = ({ data }) => {
  const galleryItems = data.entry?.map((item) => new GalleryItem(item));
  if (!galleryItems || galleryItems?.length === 0) return;
  //if (!(galleryItems && galleryItems.length > 0)) return;
  return {
    railType: galleryItems[0].type,
    railTitle: data.title,
    cardType: 'GALLERY_ITEM',
    items: galleryItems,
  };
};

// VodPreview
// Movies
export const parseVodMoviesPageData = ({ data, itemsPerRow = VODS_PER_ROW }) => {
  const railItems = data.entry?.map((item) => new SimpleRailItem(item));
  if (!railItems || railItems?.length === 0) return;

  return {
    railType: RAIL_TYPES.MOVIE,
    cardType: 'POSTER',
    items: railItems,
    itemsPerRow,
  };
};

// Series
export const parseSeriesPageData = ({ data }) => {
  const railItems = data.entry?.map((item) => new SimpleRailItem(item));
  if (!railItems || railItems?.length === 0) return;

  return {
    railType: RAIL_TYPES.SERIE,
    cardType: 'POSTER',
    items: railItems,
    itemsPerRow: VODS_PER_ROW,
  };
};

// Categories
export const parseVodCategories = ({ data }, vodType) => {
  // const railItems = data?.entry.map((category) => new Category({ ...category, type: vodType }));
  const railItems = data?.entry.map((category) => {
    // console.log('CAT', category);
    return new Category({ ...category, type: vodType });
  });
  if (!railItems || railItems?.length === 0) return;

  return {
    railType: RAIL_TYPES.CATEGORY,
    cardType: 'CATEGORY',
    items: railItems,
  };
};

// Sports
export const parseSportsPageData = ({ data }) => {
  const railItems = data.entry?.map(
    (item) => new SimpleRailItem({ ...item, type: { value: 'sport' } })
  );
  if (!railItems || railItems?.length === 0) return;

  return {
    railType: RAIL_TYPES.SPORT,
    railTitle: data.title,
    cardType: 'POSTER',
    items: railItems,
    itemsPerRow: VODS_PER_ROW,
  };
};

// Live Events
export const parseSportsEventsData = ({ data }) => {
  const railItems = data.entry?.map((item) => new LiveEventsRailItem(item));
  if (!railItems || railItems?.length === 0) return;

  return {
    railType: RAIL_TYPES.SPORT_LIVE,
    railTitle: data.title,
    cardType: 'POSTER',
    items: railItems,
    h: 400,
    railItemsOptions: {
      h: 341,
    },
  };
};

// Single assets
// Movie
export const parseDetailsData = ({ data }) => {
  console.log(data);
  return new GalleryItem(data?.entry[0]);
};

// Season
export const parseSeasonData = ({ data }) => {
  const railItems = data.entry?.map(
    (item) => new SimpleRailItem({ ...item, type: { value: 'episode' } })
  );
  if (!railItems || railItems?.length === 0) return;

  return {
    railType: RAIL_TYPES.EPISODE,
    cardType: 'POSTER',
    items: railItems,
    railTitle: data.title,
    itemsPerRow: data.entry.length,
  };
};

// Collectin Page
export const parseCollectionData = ({ data }) => {
  const railItems = data.entry?.map((item) => new SimpleRailItem(item));
  if (!railItems || railItems.length === 0) return;

  return {
    // railType: railItems[0].type,
    railType: RAIL_TYPES.COLLECTION,
    railTitle: data.title,
    cardType: 'COLLECTION',
    items: railItems,
    itemsPerRow: 4,
  };
};

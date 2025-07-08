import { Category, SimpleRailItem, LiveEventsRailItem, GalleryItem } from './';
import { parseTranslations, VODS_PER_ROW } from '../Services';
import { RAIL_TYPES } from '../pages/utils';
import { Banner } from './Banner';
import { t } from '../utils/translation';

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
    railTitle: data.railTitle,
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
  const railItems = data?.entry.map((category) => {
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

  const translations = parseTranslations();
  const title = t(translations, 'sports');

  return {
    railType: RAIL_TYPES.SPORT,
    railTitle: title,
    cardType: 'POSTER',
    items: railItems,
    itemsPerRow: VODS_PER_ROW,
  };
};

// Live Events
export const parseSportsEventsData = ({ data }) => {
  const railItems = data.entry?.map((item) => new LiveEventsRailItem(item));
  if (!railItems || railItems?.length === 0) return;

  const translations = parseTranslations();
  const title = t(translations, 'sports_events');

  return {
    railType: RAIL_TYPES.SPORT_LIVE,
    railTitle: title,
    cardType: 'POSTER',
    items: railItems,
    h: 400,
    railItemsOptions: {
      h: 370,
    },
  };
};

// Single assets
// Movie
export const parseDetailsData = ({ data }) => {
  return new GalleryItem(data?.entry[0]);
};

// Season
export const parseSeasonData = ({ data }, seriesId) => {
  const railItems = data.entry?.map(
    (item) => new SimpleRailItem({ ...item, type: { value: 'episode' }, seriesId: seriesId })
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

export const parseVodUserContentData = ({ data, itemsPerRow = VODS_PER_ROW }) => {
  const railItems = data.entry?.map((item) => new SimpleRailItem(item));
  if (!railItems || railItems?.length === 0) return;

  return {
    railType: RAIL_TYPES.USER_CONTENT,
    railTitle: data.railTitle,
    cardType: 'POSTER',
    items: railItems,
    itemsPerRow,
  };
};

// Banner
export const parseBannerData = ({ data }) => {
  const railItems = data.ads?.map((item) => new Banner(item));
  if (!railItems || railItems.length === 0) return;

  return {
    // railType: railItems[0].type,
    railType: RAIL_TYPES.BANNER,
    // railTitle: 'Advertisement',
    cardType: 'BANNER',
    items: railItems,
    itemsPerRow: 4,
  };
};

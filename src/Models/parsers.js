import { Category, SimpleRailItem, LiveEventsRailItem, GalleryItem } from './';
import { t, VODS_PER_ROW } from '../Services';
import { RAIL_TYPES, TRANSLATIONS, CARD_TYPES } from '../constants/globalConstants';
import { Banner } from './Banner';
import { ViewMoreRailItem } from './ViewMore';

// Home page
export const parseHomePageRailData = ({ data }) => {
  const railItems = data.entry?.items?.map(
    (item) => new SimpleRailItem({ ...item, orientation: data.entry.poster_format })
  );
  if (!railItems || railItems.length === 0) return;
  data.entry.has_more &&
    railItems.push(
      new ViewMoreRailItem({ id: data.entry.id, orientation: data.entry.poster_format })
    );

  return {
    railType: railItems[0].type,
    railTitle: data.entry.name,
    cardType: CARD_TYPES.POSTER,
    items: railItems,
    railId: data.entry.id,
  };
};

export const parseHomePageHeroSection = ({ data }) => {
  const galleryItems = data.entry?.items?.map(
    (item) => new GalleryItem({ ...item, media_group: data.app.contentType })
  );
  if (!galleryItems || galleryItems?.length === 0) return;
  return {
    railType: galleryItems[0].type,
    railTitle: data.title,
    cardType: CARD_TYPES.GALLERY_ITEM,
    items: galleryItems,
  };
};

// VodPreview
// Movies
export const parseVodMoviesPageData = ({ data }) => {
  const railItems = data.entry?.items?.map(
    (item) =>
      new SimpleRailItem({ ...item, orientation: data.entry.poster_format }, RAIL_TYPES.MOVIE)
  );
  if (!railItems || railItems?.length === 0) return;
  data.entry.has_more &&
    railItems.push(
      new ViewMoreRailItem({ id: data.entry.id, orientation: data.entry.poster_format })
    );

  return {
    railType: RAIL_TYPES.MOVIE,
    railTitle: data.entry.name,
    cardType: CARD_TYPES.POSTER,
    items: railItems,
    railId: data.entry.id,
  };
};

// Series
export const parseSeriesPageData = ({ data }) => {
  const railItems = data.entry.items?.map(
    (item) =>
      new SimpleRailItem({ ...item, orientation: data.entry.poster_format }, RAIL_TYPES.SERIE)
  );
  if (!railItems || railItems?.length === 0) return;
  data.entry.has_more &&
    railItems.push(
      new ViewMoreRailItem({ id: data.entry.id, orientation: data.entry.poster_format })
    );

  return {
    railType: RAIL_TYPES.SERIE,
    railTitle: data.entry.name,
    cardType: CARD_TYPES.POSTER,
    items: railItems,
    railId: data.entry.id,
  };
};

// Categories
export const parseVodCategories = (data, vodType) => {
  const railItems = data?.items.map((category) => {
    return new Category({ ...category, type: vodType });
  });
  if (!railItems || railItems?.length === 0) return;

  return {
    railType: RAIL_TYPES.CATEGORY,
    cardType: CARD_TYPES.CATEGORY,
    items: railItems,
  };
};

// Season tabs
export const parseSeasonTabs = ({ data }, vodType) => {
  const railItems = data?.entry?.items.map((category) => {
    return new Category({ ...category, type: vodType });
  });
  if (!railItems || railItems?.length === 0) return;

  return {
    railType: RAIL_TYPES.CATEGORY,
    cardType: CARD_TYPES.CATEGORY,
    items: railItems,
  };
};

// Sports
export const parseSportsPageData = ({ data }) => {
  const railItems = data.entry?.items?.map(
    (item) =>
      new SimpleRailItem(
        {
          ...item,
          type: { value: item.type ? item.type : RAIL_TYPES.SPORT },
          orientation: data.entry.poster_format,
        },
        RAIL_TYPES.SPORT
      )
  );
  if (!railItems || railItems?.length === 0) return;
  data.entry.has_more &&
    railItems.push(
      new ViewMoreRailItem({ id: data.entry.id, orientation: data.entry.poster_format })
    );

  return {
    railType: RAIL_TYPES.SPORT,
    railTitle: data.entry.name,
    cardType: CARD_TYPES.POSTER,
    items: railItems,
    railId: data.entry.id,
  };
};

// Live Events
export const parseSportsEventsData = ({ data }) => {
  const railItems = data.entry?.items?.map((item) => new LiveEventsRailItem(item));
  if (!railItems || railItems?.length === 0) return;

  const title = t(TRANSLATIONS.SPORTS_EVENTS);

  return {
    railType: RAIL_TYPES.SPORT_LIVE,
    railTitle: title,
    cardType: CARD_TYPES.POSTER,
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
  return new GalleryItem(data?.entry);
};

// Season
export const parseSeasonData = ({ data }, seriesId, seasonId) => {
  const railItems = data.entry?.items?.map(
    (item) =>
      new SimpleRailItem({ ...item, type: { value: RAIL_TYPES.EPISODE }, seriesId: seriesId })
  );
  if (!railItems || railItems?.length === 0) return;

  return {
    railType: RAIL_TYPES.EPISODE,
    cardType: CARD_TYPES.LANDSCAPE,
    items: railItems,
    railTitle: data.entry?.label,
    itemsPerRow: data.entry.length,
    seasonId,
  };
};

// Collectin Page
export const parseCollectionData = ({ data }) => {
  console.log(data);
  const railItems = data.entry?.items?.map((item) => new SimpleRailItem(item));
  if (!railItems || railItems.length === 0) return;

  return {
    railType: data.entry.type,
    railTitle: data.entry.label,
    cardType: CARD_TYPES.COLLECTION,
    items: railItems,
    itemsPerRow: 4,
  };
};

export const parseVodUserContentData = ({ data, itemsPerRow = VODS_PER_ROW }) => {
  const railItems = data.entry?.map((item) => new SimpleRailItem(item));
  if (!railItems || railItems?.length === 0) return;
  railItems &&
    railItems.length > VODS_PER_ROW &&
    railItems.push(
      new ViewMoreRailItem({ id: data.entry.id, orientation: data.entry.poster_format })
    );

  return {
    railType: data.railType,
    railTitle: data.railTitle,
    cardType: CARD_TYPES.POSTER,
    items: railItems,
    itemsPerRow,
  };
};

// Banner
export const parseBannerData = ({ data }) => {
  const railItems = data.ads?.map((item) => new Banner(item));
  if (!railItems || railItems.length === 0) return;

  return {
    railType: RAIL_TYPES.BANNER,
    cardType: CARD_TYPES.BANNER,
    items: railItems,
    itemsPerRow: 4,
  };
};

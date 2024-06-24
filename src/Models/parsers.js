import { Category, SimpleRailItem, LiveEventsRailItem } from "./";
import { VODS_PER_ROW } from "../Services/VodSerivce";
import { RAIL_TYPES } from "../Pages/utils";

// VodPreview
// Movies
export const parseVodMoviesPageData = ({ data }) => {
  const railItems = data.entry?.map((item) => new SimpleRailItem(item))
  if (!railItems || railItems.length === 0) return;

  return {
    railType: RAIL_TYPES.MOVIE,
    cardType: 'POSTER',
    items: railItems,
    itemsPerRow: VODS_PER_ROW,
  };
}

// Series
export const parseSeriesPageData = ({ data }) => {
  const railItems = data.entry?.map((item) => new SimpleRailItem(item));
  if (!railItems || railItems.length === 0) return;

  return {
    railType: RAIL_TYPES.SERIE,
    cardType: 'POSTER',
    items: railItems,
    itemsPerRow: VODS_PER_ROW,
  };
}

// Categories
export const parseVodCategories = ({ data }, vodType) => {
  const railItems = data?.entry.map(category => new Category({ ...category, type: vodType }))
  if (!railItems || railItems.length === 0) return;

  return {
    railType: RAIL_TYPES.CATEGORY,
    items: railItems,
  };
}

// Sports
export const parseSportsPageData = ({ data }) => {
  const railItems = data.entry?.map(
    (item) => new SimpleRailItem({ ...item, type: { value: 'sport' } })
  );
  if (!railItems || railItems.length === 0) return;

  return {
    railType: RAIL_TYPES.SPORT,
    railTitle: data.title,
    cardType: 'POSTER',
    items: railItems,
    itemsPerRow: VODS_PER_ROW,
  };
}

// Live Events
export const parseSportsEventsData = ({ data }) => {
  const railItems = data.entry?.map((item) => new LiveEventsRailItem(item));
  if (!railItems || railItems.length === 0) return;

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
}
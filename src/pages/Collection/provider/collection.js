import {
  CARD_TYPES,
  LOCAL_STORAGE_KEYS,
  RAIL_TYPES,
  SEARCH_TYPES,
  TRANSLATIONS,
} from '../../../constants/globalConstants';
import { parseVodUserContentDataCollectionPage } from '../../../Models';
import { CollectionService, t, UserService, SearchService } from '../../../Services';
import { constructRails } from '../../utils';

export default async function (page, { collectionId, category }) {
  const event = new CustomEvent('verticalIndexReset');
  window.dispatchEvent(event);

  let railsData;
  switch (collectionId) {
    case RAIL_TYPES.FAVORITES:
      const favorites = await UserService.getFavorites();
      railsData = constructRails(
        parseVodUserContentDataCollectionPage({
          data: {
            railTitle: t(TRANSLATIONS.FAVORITES),
            railType: RAIL_TYPES.COLLECTION,
            entry: favorites.data.favorites,
          },
        })
      );
      break;
    case RAIL_TYPES.CONTINUE_WATCHING:
      const recentlyWatched = await UserService.getRecentlyWatched();
      railsData = constructRails(
        parseVodUserContentDataCollectionPage({
          data: {
            railTitle: t(TRANSLATIONS.CONTINUE_WATCHING),
            railType: RAIL_TYPES.COLLECTION,
            entry: recentlyWatched.data.recently_watched,
          },
        })
      );
      break;
    case RAIL_TYPES.CATEGORY:
      category
        ? localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORY, JSON.stringify(category))
        : (category = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORY)));

      const searchedItems = await SearchService.getSearch(
        category.category,
        category.category,
        CARD_TYPES.COLLECTION,
        4,
        RAIL_TYPES.COLLECTION,
        category.type !== SEARCH_TYPES.SPORTS ? category.type : SEARCH_TYPES.SERIES,
        category.categoryTitle
      );

      railsData = constructRails(searchedItems);
      break;
    default:
      await CollectionService.initialFetch(collectionId);
      railsData = constructRails(CollectionService.collectionItem);
  }

  page._Column.props = {
    items: [],
    parentState: 'Column',
  };

  page._Column.props = {
    items: railsData,
    parentState: 'Column',
  };
}

import { RAIL_TYPES, TRANSLATIONS } from '../../../constants/globalConstants';
import { parseVodUserContentDataCollectionPage } from '../../../Models';
import { CollectionService, t, UserService } from '../../../Services';
import { constructRails } from '../../utils';

export default async function (page, { collectionId }) {
  let railsData;
  if (collectionId === RAIL_TYPES.FAVORITES) {
    const favorites = await UserService.getFavorites();
    console.log(favorites);
    railsData = constructRails(
      parseVodUserContentDataCollectionPage({
        data: {
          railTitle: t(TRANSLATIONS.FAVORITES),
          railType: RAIL_TYPES.COLLECTION,
          entry: favorites.data.favorites,
        },
      })
    );
  } else if (collectionId === RAIL_TYPES.CONTINUE_WATCHING) {
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
  } else {
    await CollectionService.initialFetch(collectionId);
    railsData = constructRails(CollectionService.collectionItem);
  }

  console.log(railsData);

  page._Column.props = {
    items: [],
    parentState: 'Column',
  };

  // const rails = constructRails(CollectionService.collectionItem);

  page._Column.props = {
    items: railsData,
    parentState: 'Column',
  };
}

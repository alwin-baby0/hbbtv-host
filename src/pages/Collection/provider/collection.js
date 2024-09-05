import { CollectionService } from '../../../Services/CollectionService';

export default async function (page, { collectionId }) {
  await CollectionService.initialFetch(collectionId);

  page._Column.items = [];
  page.props = {
    h: 430,
    items: CollectionService.collectionItem,
  };
}

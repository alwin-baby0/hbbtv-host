import { CollectionService } from '../../../Services/CollectionService';
import { constructRails } from '../../utils';

export default async function (page, { collectionId }) {
  await CollectionService.initialFetch(collectionId);

  page._Column.props = {
    items: [],
  };
  const rails = constructRails(CollectionService.collectionItem);
  page._Column.props = {
    items: rails,
  };
}

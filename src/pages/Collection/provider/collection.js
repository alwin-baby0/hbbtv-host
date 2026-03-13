import { CollectionService } from '../../../Services';
import { constructRails } from '../../utils';

export default async function (page, { collectionId }) {
  await CollectionService.initialFetch(collectionId);

  page._Column.props = {
    items: [],
    parentState: 'Column',
  };

  const rails = constructRails(CollectionService.collectionItem);

  page._Column.props = {
    items: rails,
    parentState: 'Column',
  };
}

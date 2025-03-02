import { V2 } from '../utils';
import { parseCollectionData } from '../../Models';
import FetchingService from '../FetchingService';

class CollectionService extends FetchingService {
  #collectionItem;

  async initialFetch(collectionId) {
    this.resetData();

    const collectionResult = await this.#getColection(collectionId);
    this.#collectionItem = collectionResult;
  }

  /**
   * Resets data for home page service
   */
  resetData() {
    this.#collectionItem = undefined;
  }

  get collectionItem() {
    return this.#collectionItem;
  }

  #getColection = async (collectionId) =>
    this._request({
      url: '/getCollection',
      apiVersion: V2,
      method: 'GET',
      params: {
        id: collectionId,
      },
    }).then(parseCollectionData);
}

const collectionService = new CollectionService();

export { collectionService as CollectionService };

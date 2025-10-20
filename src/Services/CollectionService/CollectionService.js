import { V2 } from '../utils';
import { parseCollectionData } from '../../Models';
import FetchingService from '../FetchingService';
import { API_METHODS, API_URLS } from '../../constants/globalConstants';

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
      url: `/${API_URLS.GET_COLLECTION}`,
      apiVersion: V2,
      method: API_METHODS.GET,
      params: {
        id: collectionId,
      },
    }).then(parseCollectionData);
}

const collectionService = new CollectionService();

export { collectionService as CollectionService };

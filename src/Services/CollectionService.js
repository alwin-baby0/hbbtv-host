// import { GalleryItem } from '../Models';
// import { parseDetailsData, parseSeasonData } from '../Models/parsers';
import { parseCollectionData } from '../Models';
import FetchingService from './FetchingService';
import { V2 } from './utils';

// class CollectionService extends FetchingService {
//   #collectionItem;

//   async initialFetch(collectionId) {
//     const collectionResult = await this.#getColection(collectionId);
//     this.#collectionItem = collectionResult;
//   }

//   /**
//    * Resets data for home page service
//    */
//   resetData() {
//     this.#collectionItem = undefined;
//   }

//   get collectionItem() {
//     return this.#collectionItem;
//   }

//   #getColection = async (collectionId) =>
//     this._request({
//       url: '/getCollection',
//       apiVersion: V2,
//       method: 'GET',
//       params: {
//         id: collectionId,
//       },
//     }).then(parseCollectionData);
// }

// const collectionService = new CollectionService();

// export { collectionService as CollectionService };

class CollectionService extends FetchingService {
  #collectionItem;

  async initialFetch(collectionId) {
    // Resetovanje stanja pre novog fetch-a
    this.resetData();
    console.log('PONOVO SAM OVDE');

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

import { Event, GalleryItem } from "../Models";
import { parseDetailsData, parseSeasonData } from "../Models/parsers";
import { VOD_PREVIEW_TYPES } from "../Pages/utils";
import FetchingService from "./FetchingService";
import { VodService } from "./VodSerivce";
import { V2 } from "./utils";

class DetailService extends FetchingService {
  getMovie = async (movieId) =>
    await this._request({
      url: `/getMovie`,
      apiVersion: V2,
      method: 'GET',
      params: {
        id: movieId,
      },
    }).then(parseDetailsData);

  getSerie = async (seriesId) => {
    const galleryItem = await this._request({
      url: '/getSerie',
      apiVersion: V2,
      method: 'GET',
      params: {
        id: seriesId,
      },
    }).then(parseDetailsData);

    const seasonTabs = await this._request({
      url: '/getSeasonTabs',
      apiVersion: V2,
      method: 'GET',
      params: {
        series_id: seriesId,
      },
    }).then(({ data }) => data?.entry?.map((tab) => tab.id));

    const seasonsPromises =
      seasonTabs.map((id) =>
        this._request({
          url: '/getSeason',
          apiVersion: V2,
          method: 'GET',
          params: {
            season_id: id,
          },
        }))

    const seasons = await Promise.allSettled(seasonsPromises);

    return {
      galleryItem,
      seasons: seasons.map(({ value }) => parseSeasonData(value)),
    }
  }

  getSport = async (sportId) => {
    return await this.getSerie(sportId);
  }

  getEvent = async (eventId) =>
    this._request({
      url: '/getSportEvent',
      apiVersion: V2,
      method: 'GET',
      params: {
        id: eventId,
      },
    }).then(({ data }) => new GalleryItem(data?.entry[0]))
}

const detailService = new DetailService();

export { detailService as DetailService };

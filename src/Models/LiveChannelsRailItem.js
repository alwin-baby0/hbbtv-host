// This class is used as generic class for:
// Home, Search, Movies, Series, Sports screens rails
import { Metrics } from '@firebolt-js/sdk';
import { ROUTES, RAIL_TYPES } from '../constants/globalConstants';
import { getDeviceInfo, getDeviceType } from '../utils/device';
import logger from '../utils/logger';

class LiveChannelsRailItem {
  constructor(data) {
    const { id, title, type, media_group } = data;
    this.id = id;
    this.title = title;
    this.type = type?.value;

    switch (this.type) {
      case RAIL_TYPES.MOVIE:
        this.url = `${ROUTES.MOVIE_DETAILS}/${this.id}`;
        break;
      case RAIL_TYPES.SPORT:
      case RAIL_TYPES.SERIE:
        this.url = `${ROUTES.SERIES_DETAILS}/${this.id}`;
        break;
      case RAIL_TYPES.SHOW:
      case RAIL_TYPES.EVENT:
        this.url = `${ROUTES.EVENT_DETAILS}/${this.id}`;
        break;
      case RAIL_TYPES.EPISODE:
        this.url = data.content.src;
        this.duration = data.extensions.duration;
        break;
      case RAIL_TYPES.LIVE_CHANNEL:
        break;
      case RAIL_TYPES.EPG_CHANNEL:
        break;
      default:
        console.warn('unknown rail item type', this.type);
    }

    this.thumbnails = [];
    this.landscapePosters = [];
    this.portraitPosters = [];

    if (media_group) {
      media_group[0]?.media_item?.forEach((item) => {
        switch (true) {
          case item.key.includes('image_base'): {
            this.thumbnails.push(item);
            this.landscapePosters.push(item);
            this.portraitPosters.push(item);
            break;
          }
          case item.key.includes('image_base'): {
            this.landscapePosters.push(item);
            break;
          }
          case item.key.includes('image_base'): {
            this.portraitPosters.push(item);
            break;
          }
          default:
            break;
        }
      });
    }
  }

  preloadImages(size) {
    const imageUrls = [
      this.getThumbnailImage(size).src,
      this.getLandscapePoster(size).src,
      this.getPortraitPoster(size).src,
    ];

    imageUrls.forEach((url) => {
      try {
        const urlObj = new URL(url);
        const image = new Image();
        image.src = urlObj.toString();
      } catch {
        const deviceInfo = getDeviceInfo();
        logger.error(error.message ? error.message : 'Error parsing image', {
          id: url,
          error,
          deviceId: deviceInfo.serialNumber,
          device: deviceInfo,
        });
        const deviceType = getDeviceType();
        deviceType === 'metrological' &&
          Metrics.error(Metrics.ErrorType.MEDIA, '400', 'Error parsing image', true);
        // skip
      }
    });
  }

  getThumbnailImage(size) {
    const thumbnail = this.thumbnails.find((thumbnail) => thumbnail.key.includes(size));
    return thumbnail ?? this.thumbnails[0];
  }

  getLandscapePoster(size) {
    const poster = this.landscapePosters.find((poster) => poster.key.includes(size));
    return poster ?? this.landscapePosters[0];
  }

  getPortraitPoster(size) {
    const poster = this.portraitPosters.find((poster) => poster.key.includes(size));
    return poster ?? this.portraitPosters[0];
  }
}

export { LiveChannelsRailItem };

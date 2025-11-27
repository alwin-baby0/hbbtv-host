// This class is used as generic class for:
// Home, Search, Movies, Series, Sports screens rails
import { ROUTES, RAIL_TYPES } from '../constants/globalConstants';

class SimpleRailItem {
  constructor(data) {
    console.log('asdf data: ', data);
    const { id, title, type, summary, images, meta } = data;

    this.id = id;
    this.title = title;
    this.type = type;
    this.summary = summary;

    // if (extensions) {
    //   this.description = extensions.description;
    //   this.episodeSeriesID = extensions?.series_id;
    //   this.duration = extensions?.duration;
    // }

    // if (extensions?.ssai) {
    //   this.ssai = extensions.ssai;
    // }

    switch (this.type) {
      case RAIL_TYPES.MOVIE:
      case RAIL_TYPES.VIDEO:
        this.url = `${ROUTES.MOVIE_DETAILS}/${this.id}`;
        break;
      case RAIL_TYPES.SPORT:
      case RAIL_TYPES.SERIE:
      case RAIL_TYPES.SERIES:
        // if (this.episodeSeriesID) {
        //   //case if you are coming from recently watched list
        //   this.url = `${ROUTES.SERIES_DETAILS}/${this.episodeSeriesID}`;
        // } else {
        this.url = `${ROUTES.SERIES_DETAILS}/${this.id}`;
        // }
        break;
      case RAIL_TYPES.SHOW:
      case RAIL_TYPES.EVENT:
        this.url = `${ROUTES.EVENT_DETAILS}/${this.id}`;
        break;
      case RAIL_TYPES.EPISODE:
        this.url = data.content?.src;
        this.duration = data.extensions?.duration;
        this.seriesId = data.seriesId;
        break;
      case RAIL_TYPES.CHANNEL:
        this.url = `${ROUTES.LIVE}`;
      default:
        console.warn('unknown rail item type', this.type);
    }

    if (meta) {
      const { duration, year } = meta;

      this.durationString = duration?.string;
      this.year = year;
    }

    this.thumbnails = [];
    this.landscapePosters = [];
    this.portraitPosters = [];
    this.channelImages;

    if (images.landscape) {
      const landscapeKeysOriginal = Object.keys(images.landscape);
      const landscapeKeys = landscapeKeysOriginal.map((item) => `poster_landscape_${item}`);

      landscapeKeys.forEach((item, index) =>
        this.landscapePosters.push({
          key: item,
          src: images.landscape[landscapeKeysOriginal[index]],
        })
      );
    }

    if (images.thumbnail) {
      const thumbnailKeysOriginal = Object.keys(images.thumbnail);
      const thumbnailKeys = thumbnailKeysOriginal.map((item) => `thumbnail_${item}`);

      thumbnailKeys.forEach((item, index) =>
        this.thumbnails.push({ key: item, src: images.thumbnail[thumbnailKeysOriginal[index]] })
      );
    }

    if (images.poster) {
      const portraitKeysOriginal = Object.keys(images.poster);
      const portraitKeys = portraitKeysOriginal.map((item) => `poster_portrait_${item}`);

      portraitKeys.forEach((item, index) =>
        this.portraitPosters.push({ key: item, src: images.poster[portraitKeysOriginal[index]] })
      );
    }

    if (Array.isArray(images)) {
      this.channelImages = images[0];
    }
  }

  preloadImages(size) {
    const imageUrls = [
      this.getThumbnailImage(size)?.src,
      this.getLandscapePoster(size)?.src,
      this.getPortraitPoster(size)?.src,
    ];

    imageUrls.forEach((url) => {
      try {
        const urlObj = new URL(url);
        const image = new Image();
        image.src = urlObj.toString();
      } catch {
        // skip
      }
    });
  }

  getThumbnailImage(size) {
    const thumbnail = this.thumbnails.find((thumbnail) => thumbnail.key.includes(size));
    return thumbnail
      ? this.thumbnails[0]
      : { key: 'applicaster_logo', src: this.channelImages.applicaster_logo };
  }

  getLandscapePoster(size) {
    const poster = this.landscapePosters.find((poster) => poster.key.includes(size));
    return poster
      ? this.landscapePosters[0]
      : { key: 'applicaster_logo', src: this.channelImages.applicaster_logo };
  }

  getPortraitPoster(size) {
    const poster = this.portraitPosters.find((poster) => poster.key.includes(size));
    return poster
      ? this.portraitPosters[0]
      : { key: 'applicaster_logo', src: this.channelImages.applicaster_logo };
  }
}

export { SimpleRailItem };

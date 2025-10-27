// This class is used as generic class for:
// Home, Search, Movies, Series, Sports screens rails
import { PATH, RAIL_TYPES } from '../constants/globalConstants';

class SimpleRailItem {
  constructor(data) {
    const { id, title, type, media_group, summary, extensions } = data;

    this.id = id;
    this.title = title;
    this.type = type?.value;
    this.summary = summary;

    if (extensions) {
      this.description = extensions.description;
      this.episodeSeriesID = extensions?.series_id;
      this.duration = extensions?.duration;
    }

    if (extensions?.ssai) {
      this.ssai = extensions.ssai;
    }

    switch (this.type) {
      case RAIL_TYPES.MOVIE:
      case RAIL_TYPES.VIDEO:
        this.url = `${PATH.MOVIE_DETAILS}/${this.id}`;
        break;
      case RAIL_TYPES.SPORT:
      case RAIL_TYPES.SERIE:
      case RAIL_TYPES.SERIES:
        if (this.episodeSeriesID) {
          //case if you are coming from recently watched list
          this.url = `${PATH.SERIES_DETAILS}/${this.episodeSeriesID}`;
        } else {
          this.url = `${PATH.SERIES_DETAILS}/${this.id}`;
        }
        break;
      case RAIL_TYPES.SHOW:
      case RAIL_TYPES.EVENT:
        this.url = `${PATH.EVENT_DETAILS}/${this.id}`;
        break;
      case RAIL_TYPES.EPISODE:
        this.url = data.content?.src;
        this.duration = data.extensions?.duration;
        this.seriesId = data.seriesId;
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
          case item.key.includes('thumbnail'): {
            this.thumbnails.push(item);
            break;
          }
          case item.key.includes('poster_landscape'): {
            this.landscapePosters.push(item);
            break;
          }
          case item.key.includes('poster_portrait'): {
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

export { SimpleRailItem };

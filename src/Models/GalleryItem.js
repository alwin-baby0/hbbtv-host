import { TRANSLATIONS } from '../constants/globalConstants';
import { t } from '../Services';

class GalleryItem {
  constructor(data) {
    const { id, title, content, files, summary, type, meta, images } = data;

    this.id = id;

    this.title = title;
    this.summary = summary;
    this.trailerSrc = ''; // this is not returned by backend
    this.buttonLabel = t(TRANSLATIONS.WATCH_NOW);

    this.type = type;
    this.trailerUrl = files[0].url;

    this.dateRange = meta.date_range?.timestamp[0];

    if (content) {
      this.url = content.src;
      this.videoType = content.type;
    }

    if (files.ssai) {
      this.ssai = files.ssai;
    }

    if (files.last_played_episode) {
      this.url = files.last_played_episode.hls;
      this.position = files.last_played_episode.position;
      this.lastPlayedId = files.last_played_episode.video_id;
    }

    if (meta) {
      const {
        button_text,
        description,
        duration,
        genre,
        director,
        subtitle,
        first_episode_mp4,
        cast,
        venue,
        is_favorite,
        last_position,
        trailer,
        rating,
      } = files;

      if (button_text && button_text !== '') {
        this.buttonLabel = button_text;
      }

      if (!this.url) {
        this.url = first_episode_mp4;
      }

      if (!this.summary || this.summary === '') {
        const { date, time, venue } = files;
        this.summary = '';
        if (date) {
          this.summary += `${files.date} - `;
        }
        if (time) {
          this.summary += `${files.time} | `;
        }
        if (venue) {
          this.summary += `${files.venue}`;
        }
      }

      this.description = description;
      this.duration = duration;
      this.genre = genre;
      this.director = director;
      this.subtitle = subtitle;
      this.cast = cast;
      this.venue = venue;
      this.is_favorite = is_favorite;
      this.last_position = last_position;
      this.trailer = trailer;
      this.rating = rating;
    }

    this.thumbnails = [];
    this.landscapePosters = [];
    this.portraitPosters = [];
    this.buttonLabel = t(TRANSLATIONS.WATCH_NOW);

    const landscapeKeysOriginal = Object.keys(images.landscape);
    const landscapeKeys = landscapeKeysOriginal.map((item) => `poster_landscape_${item}`);

    landscapeKeys.forEach((item, index) =>
      this.landscapePosters.push({ key: item, src: images.landscape[landscapeKeysOriginal[index]] })
    );

    const thumbnailKeysOriginal = Object.keys(images.thumbnail);
    const thumbnailKeys = thumbnailKeysOriginal.map((item) => `thumbnail_${item}`);

    thumbnailKeys.forEach((item, index) =>
      this.thumbnails.push({ key: item, src: images.thumbnail[thumbnailKeysOriginal[index]] })
    );

    const portraitKeysOriginal = Object.keys(images.poster);
    const portraitKeys = portraitKeysOriginal.map((item) => `poster_portrait_${item}`);

    portraitKeys.forEach((item, index) =>
      this.portraitPosters.push({ key: item, src: images.poster[portraitKeysOriginal[index]] })
    );
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

    if (thumbnail) return thumbnail;

    for (let i = this.thumbnails.length - 1; i >= 0; i--) {
      if (this.thumbnails[i] != null) {
        return this.thumbnails[i];
      }
    }
  }

  getLandscapePoster(size) {
    const poster = this.landscapePosters.find((poster) => poster.key.includes(size));

    if (poster) return poster;

    for (let i = this.landscapePosters.length - 1; i >= 0; i--) {
      if (this.landscapePosters[i] != null) {
        return this.landscapePosters[i];
      }
    }
  }

  getPortraitPoster(size) {
    const poster = this.portraitPosters.find((poster) => poster.key.includes(size));

    if (poster) return poster;

    for (let i = this.portraitPosters.length - 1; i >= 0; i--) {
      if (this.portraitPosters[i] != null) {
        return this.portraitPosters[i];
      }
    }
  }
}

export { GalleryItem };

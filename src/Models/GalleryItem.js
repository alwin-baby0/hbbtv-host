import { Metrics } from '@firebolt-js/sdk';
import { LOG_LEVEL, TRANSLATIONS } from '../constants/globalConstants';
import { t } from '../utils';
import { getDeviceInfo, getDeviceType } from '../utils/device';
import { LoggingService } from '../Services/index.js';

class GalleryItem {
  constructor(data = {}) {
    const {
      id = '',
      title,
      files,
      summary,
      type,
      meta,
      images,
      schedule,
      list_schedule,
      streams,
      date,
      time,
      playlists,
      user,
    } = data;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let dateFormat = '';
    if (time) {
      const zeroDate = new Date(date + 'T' + time);
      dateFormat = Intl.DateTimeFormat('en-US', {
        timeZone: timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(zeroDate);
    }

    this.id = id;

    this.title = title;
    this.summary = summary;
    this.trailerSrc = ''; // this is not returned by backend
    this.buttonLabel = t(TRANSLATIONS.WATCH_NOW);
    this.type = type;
    this.videoType = type;
    this.videoUrl = files?.[1]?.url || files?.[0]?.url || null;
    this.trailerUrl = meta && meta.trailer ? meta.trailer : null;
    this.eventDate = date;
    this.eventTime = time ? dateFormat : null;
    this.playlists = playlists || null;
    this.favorited = user?.isFavorite;
    this.list_schedule = [];

    if (meta) {
      const {
        cast,
        director,
        genre,
        ratings,
        duration,
        year,
        country,
        imdb,
        first_episode,
        badges,
        series,
      } = meta;

      this.duration = duration?.seconds;
      this.genre = genre || first_episode?.meta?.genre;
      this.director = director || first_episode?.meta?.director;
      this.cast = cast || first_episode?.meta?.cast;
      this.rating = ratings?.fsk || first_episode?.meta?.rating?.fsk;
      this.durationString = duration?.string || first_episode?.meta?.duration?.string;
      this.year = year || first_episode?.meta?.year;
      this.country = country || first_episode?.meta?.country;
      this.imdbScore = imdb?.score || first_episode?.meta?.imdb?.score;
      this.badgeText = badges?.[0]?.label;
      this.seasonNumber = series?.season;
      this.episodeNumber = series?.episode;

      if (first_episode) {
        this.firstEpisodeId = first_episode?.id;
        this.firstEpisodeUrl = first_episode?.files[0]?.url;
        this.firstEpisodeTitle = first_episode?.title;
        this.firstEpisodeSeasonNumber = first_episode?.meta?.series?.season;
        this.firstEpisodeEpisodeNumber = first_episode?.meta?.series?.episode;
      }
    }

    if (schedule) {
      const { start_time, end_time } = schedule;
      this.startTime = new Date(start_time).getTime();
      this.endTime = new Date(end_time).getTime();
    }

    if (list_schedule) {
      this.list_schedule = list_schedule;
    } else if (schedule) {
      this.list_schedule = Array.isArray(schedule) ? schedule : [schedule];
    }

    if (streams) {
      const streamUrl = streams?.[0]?.m3u8 || streams?.[1]?.m3u8 || null;
      this.streamUrl = streamUrl;
    }

    this.thumbnails = [];
    this.landscapePosters = [];
    this.portraitPosters = [];
    this.buttonLabel = t(TRANSLATIONS.WATCH_NOW);

    const landscapeKeysOriginal = Object.keys(images?.landscape ?? {});
    const landscapeKeys = landscapeKeysOriginal.map((item) => `poster_landscape_${item}`);

    landscapeKeys.forEach((item, index) =>
      this.landscapePosters.push({ key: item, src: images.landscape[landscapeKeysOriginal[index]] })
    );

    const thumbnailKeysOriginal = Object.keys(images?.thumbnail ?? {});
    const thumbnailKeys = thumbnailKeysOriginal.map((item) => `thumbnail_${item}`);

    thumbnailKeys.forEach((item, index) =>
      this.thumbnails.push({ key: item, src: images.thumbnail[thumbnailKeysOriginal[index]] })
    );

    const portraitKeysOriginal = Object.keys(images?.poster ?? {});
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
        const deviceInfo = getDeviceInfo();
        LoggingService.postLog(LOG_LEVEL.ERROR, deviceInfo, {
          message: 'Error parsing image',
          error,
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

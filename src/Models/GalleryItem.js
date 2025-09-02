class GalleryItem {
  constructor(data) {
    const { id, title, content, extensions, media_group, summary, type } = data;

    this.id = id;

    this.title = title;
    this.summary = summary;
    this.trailerSrc = ''; // this is not returned by backend
    this.buttonLabel = 'WATCH NOW';

    this.type = type;
    this.trailerUrl = extensions.preview_playback;

    this.dateRange = extensions.date_range?.timestamp;

    if (content) {
      this.url = content.src;
      this.videoType = content.type;
    }

    if (extensions.ssai) {
      this.ssai = extensions.ssai;
    }

    if (extensions.last_played_episode) {
      this.url = extensions.last_played_episode.hls;
      this.position = extensions.last_played_episode.position;
      this.lastPlayedId = extensions.last_played_episode.video_id;
    }

    if (extensions) {
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
      } = extensions;

      if (button_text && button_text !== '') {
        this.buttonLabel = button_text;
      }

      if (!this.url) {
        this.url = first_episode_mp4;
      }

      if (!this.summary || this.summary === '') {
        const { date, time, venue } = extensions;
        this.summary = '';
        if (date) {
          this.summary += `${extensions.date} - `;
        }
        if (time) {
          this.summary += `${extensions.time} | `;
        }
        if (venue) {
          this.summary += `${extensions.venue}`;
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
    }

    this.thumbnails = [];
    this.landscapePosters = [];
    this.portraitPosters = [];
    this.buttonLabel = 'WATCH NOW';

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
        case item.key.includes('stream_placeholder'): {
          this.landscapePosters.push(item);
        }
        default:
          break;
      }
    });
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

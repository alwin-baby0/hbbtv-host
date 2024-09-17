// This class is used as generic class for:
// Home, Search, Movies, Series, Sports screens rails
class SimpleRailItem {
  constructor(data) {
    const { id, title, type, media_group, summary } = data;
    this.id = id;
    this.title = title;
    this.type = type?.value;
    this.summary = summary;

    switch (this.type) {
      case 'movie':
      case 'video':
        this.url = `movie-details/${this.id}`;
        break;
      case 'sport':
      case 'serie':
      case 'series':
        this.url = `series-details/${this.id}`;
        break;
      case 'show':
      case 'event':
        this.url = `event-details/${this.id}`;
        break;
      case 'episode':
        this.url = data.content?.src;
        this.duration = data.extensions?.duration;
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

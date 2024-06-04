import MoviesRailItem from './MoviesRailItem';

class SingleMovieRailItem extends MoviesRailItem {
  constructor(data) {
    super(data);
    const { content, extensions, summary, media_group } = data;

    this.summary = summary;
    if (content) {
      this.videoSrc = content.src;
    }
    this.buttonText = extensions.button_text;
    this.description = extensions.description;
    this.genre = extensions.genre;
    this.director = extensions.director;
    this.subtitle = extensions.subtitle;

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

SingleMovieRailItem.small = '360';
SingleMovieRailItem.medium = '480';
SingleMovieRailItem.larg = '720';
SingleMovieRailItem.extraLarge = '1080';

export default SingleMovieRailItem;

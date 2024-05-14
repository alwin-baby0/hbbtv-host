class HomeRailItem {
  constructor(data) {
    const { title, summary, type, content, extensions, media_group } = data;

    this.title = title;
    this.summary = summary;
    this.type = type?.value;
    this.content = {
      type: content?.type,
      src: content?.src,
    };

    this.duration = extensions?.duration;
    this.description = extensions?.description;
    this.cast = extensions?.cast;
    this.director = extensions?.director;
    this.year = extensions?.year;
    this.previewPlayback = extensions?.preview_playback;
    this.thumbnails = [];
    this.landscapePosters = [];
    this.portraitPosters = [];

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

HomeRailItem.small = '360';
HomeRailItem.medium = '480';
HomeRailItem.larg = '720';
HomeRailItem.extraLarge = '1080';

export default HomeRailItem;

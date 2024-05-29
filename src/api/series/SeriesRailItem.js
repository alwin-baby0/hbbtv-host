class SeriesRailItem {
  constructor(data) {
    const { id, title, images } = data;
    this.id = id;
    this.title = title;
    this.image = images;

    this.thumbnails = [];
    this.landscapePosters = [];
    this.portraitPosters = [];

    for (const key in images) {
      if (images.hasOwnProperty(key)) {
        const imageType = key.split('_')[0];
        const imageSize = key.split('_')[2];

        switch (imageType) {
          case 'thumbnail': {
            this.thumbnails.push({ key: key, src: images[key] });
            break;
          }
          case 'poster': {
            if (key.includes('landscape')) {
              this.landscapePosters.push({ key: key, src: images[key] });
            } else if (key.includes('portrait')) {
              this.portraitPosters.push({ key: key, src: images[key] });
            }
            break;
          }
          default:
            break;
        }
      }
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

SeriesRailItem.small = '360';
SeriesRailItem.medium = '480';
SeriesRailItem.larg = '720';
SeriesRailItem.extraLarge = '1080';

export default SeriesRailItem;

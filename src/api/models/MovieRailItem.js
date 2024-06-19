import { SimpleRailItem } from './SimpleRailItem';

class MovieRailItem extends SimpleRailItem {
  constructor(data) {
    super(data);
    const { content, extensions, summary } = data;

    this.summary = summary;
    if (content) {
      this.videoSrc = content.src;
    }

    this.buttonText = extensions.button_text;
    this.duration = extensions.duration;
    this.description = extensions.description;
    this.genre = extensions.genre;
    this.director = extensions.director;
    this.subtitle = extensions.subtitle;
  }
}

export { MovieRailItem };

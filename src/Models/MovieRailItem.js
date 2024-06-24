import { SimpleRailItem } from './SimpleRailItem';

class MovieRailItem extends SimpleRailItem {
  constructor(data) {
    super(data);
    const { content, extensions } = data;

    if (content) {
      this.videoSrc = content.src;
    }

    if (extensions) {
      const { button_text, duration, description, genre, director, subtitle } = extensions;

      this.buttonText = button_text;
      this.duration = duration;
      this.description = description;
      this.genre = genre;
      this.director = director;
      this.subtitle = subtitle;
    }
  }
}

export { MovieRailItem };

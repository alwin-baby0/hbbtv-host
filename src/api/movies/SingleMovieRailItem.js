import MoviesRailItem from './MoviesRailItem';

class SingleMovieRailItem extends MoviesRailItem {
  constructor(data) {
    super(data);
    const { content, extensions, summary } = data;

    this.summary = summary;
    this.videoSrc = content.src;
    this.buttonText = extensions.button_text;
    this.description = extensions.description;
    this.genre = extensions.genre;
    this.director = extensions.director;
    this.subtitle = extensions.subtitle;
  }
}

export default SingleMovieRailItem;

import { Router } from '@lightningjs/sdk';

export const CATEGORY_TYPES = {
  MOVIES: 'movies',
  MOVIE: 'movie',
  SERIES: 'series',
  SPORTS: 'sports',
  LIVE_TV: 'live',
  CHANNELS: 'channel',
  SERIE: 'genres_series',
  VIDEO: 'video',
  COLLECTION: 'collection',
  EVENT: 'event',
  LIVESTREAM: 'livestream',
};

class Category {
  constructor(data) {
    const { id, title, type } = data;
    this.id = id;
    this.title = title;
    this.type = type;
    this.data = data;
  }

  navigateToLink = () => {
    switch (this.type) {
      case CATEGORY_TYPES.MOVIES: {
        Router.navigate(`filterPage/${this.id}/movie`, this.data);
        break;
      }
      case CATEGORY_TYPES.SERIES: {
        Router.navigate(`filterPage/${this.id}/series`, this.data);
        break;
      }
      case CATEGORY_TYPES.LIVE_TV: {
        this.changeGenre = this.data;
        break;
      }
      case CATEGORY_TYPES.CHANNELS: {
        // console.log('Router CHANNEL:', this.data);
        this.changeGenre = this.data;
        Router.navigate(`live/:${this.id}?`);
        break;
      }
      default:
        console.warn('unknown category type:', this.type);
    }
  };
}

export { Category };

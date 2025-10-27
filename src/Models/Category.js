import { Router } from '@lightningjs/sdk';
import { CATEGORY_TYPES, PATH } from '../constants/globalConstants';

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
        Router.navigate(`${PATH.FILTER_PAGE}/${this.id}/${CATEGORY_TYPES.MOVIE}`, this.data);
        break;
      }
      case CATEGORY_TYPES.SERIES: {
        Router.navigate(`${PATH.FILTER_PAGE}/${this.id}/${CATEGORY_TYPES.SERIES}`, this.data);
        break;
      }
      case CATEGORY_TYPES.LIVE_TV: {
        this.changeGenre = this.data;
        break;
      }
      case CATEGORY_TYPES.CHANNELS: {
        this.changeGenre = this.data;
        Router.navigate(`${PATH.LIVE}/:${this.id}?`);
        break;
      }
      default:
        console.warn('unknown category type:', this.type);
    }
  };
}

export { Category };

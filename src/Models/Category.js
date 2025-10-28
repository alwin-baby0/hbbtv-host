import { Router } from '@lightningjs/sdk';
import { CATEGORY_TYPES, ROUTES } from '../constants/globalConstants';

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
        Router.navigate(`${ROUTES.FILTER_PAGE}/${this.id}/${ROUTES.MOVIES}`, this.data);
        break;
      }
      case CATEGORY_TYPES.SERIES: {
        Router.navigate(`${ROUTES.FILTER_PAGE}/${this.id}/${ROUTES.SERIES}`, this.data);
        break;
      }
      case CATEGORY_TYPES.LIVE_TV: {
        this.changeGenre = this.data;
        break;
      }
      case CATEGORY_TYPES.CHANNELS: {
        this.changeGenre = this.data;
        Router.navigate(`${ROUTES.LIVE}/:${this.id}?`);
        break;
      }
      default:
        console.warn('unknown category type:', this.type);
    }
  };
}

export { Category };

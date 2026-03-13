import { Router } from '@lightningjs/sdk';
import { CATEGORY_TYPES, FILTER_TYPES, ROUTES } from '../constants/globalConstants';

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
        console.log(this.data);
        const event = new CustomEvent('changeContent', {
          detail: {
            category: this.data.id,
            type: 'movie',
            categoryMessage: this.data.title,
          }, // pass whatever value you need here
        });
        window.dispatchEvent(event);
        break;
      }
      case CATEGORY_TYPES.SERIES: {
        const event = new CustomEvent('changeContent', {
          detail: {
            category: this.data.id,
            type: this.data.type,
            categoryMessage: this.data.title,
          }, // pass whatever value you need here
        });
        window.dispatchEvent(event);
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
      case CATEGORY_TYPES.SEASON_TABS: {
        const event = new CustomEvent('switchS', {
          detail: { seasonId: this.id }, // pass whatever value you need here
        });
        window.dispatchEvent(event);
        break;
      }
      default:
        console.warn('unknown category type:', this.type);
    }
  };
}

export { Category };

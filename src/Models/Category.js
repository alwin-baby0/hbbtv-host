import { Router } from '@lightningjs/sdk';
import { CATEGORY_TYPES, ROUTES } from '../constants/globalConstants';

class Category {
  constructor(data) {
    const { id, title, type, name } = data;
    this.id = id;
    this.title = title || name;
    this.type = type;
    this.data = data;
  }

  navigateToLink = () => {
    switch (this.type) {
      case CATEGORY_TYPES.MOVIES: {
        const event = new CustomEvent('changeContent', {
          detail: { category: this.data.localised, type: this.data.type }, // pass whatever value you need here
        });
        window.dispatchEvent(event);
        break;
      }
      case CATEGORY_TYPES.SERIES: {
        const event = new CustomEvent('changeContent', {
          detail: { category: this.data.localised, type: this.data.type }, // pass whatever value you need here
        });
        window.dispatchEvent(event);
        break;
      }
      case CATEGORY_TYPES.SPORTS: {
        const event = new CustomEvent('changeContent', {
          detail: { category: this.data.localised, type: this.data.type }, // pass whatever value you need here
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

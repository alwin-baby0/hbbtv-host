import { Router } from '@lightningjs/sdk';
import { CATEGORY_TYPES, RAIL_TYPES, ROUTES } from '../constants/globalConstants';

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
      case CATEGORY_TYPES.MOVIES:
      case CATEGORY_TYPES.SERIES:
      case CATEGORY_TYPES.SPORTS: {
        const category = { category: this.data.localised, type: this.data.type };
        Router.navigate(`${ROUTES.COLLECTION}/${RAIL_TYPES.CATEGORY}`, { category });
        break;
      }
      case CATEGORY_TYPES.LIVE_TV: {
        this.changeGenre = this.data;
        break;
      }
      case CATEGORY_TYPES.CHANNELS: {
        this.changeGenre = this.data;
        Router.navigate(`${ROUTES.LIVE}/:${this.id}`);
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

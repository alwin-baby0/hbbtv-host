import { Router } from '@lightningjs/sdk';
import { CATEGORY_TYPES } from '../constants/globalConstants';

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
        this.changeGenre = this.data;
        Router.navigate(`live/:${this.id}?`);
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

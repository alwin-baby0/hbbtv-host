import { Router } from "@lightningjs/sdk";
import { VOD_PREVIEW_TYPES } from "../Pages/utils";

export const CATEGORY_TYPES = {
  ...VOD_PREVIEW_TYPES,
  LIVE_TV: 'live_tv',
}

class Category {
  constructor(data) {
    const { id, title, type } = data;
    this.id = id;
    this.title = title;
    this.type = type;
  }

  navigateToLink = () => {
    switch (this.type) {
      case CATEGORY_TYPES.MOVIES: {
        Router.navigate(`filterPage/${this.id}/movie`);
        break;
      }
      case CATEGORY_TYPES.SERIES: {
        Router.navigate(`filterPage/${this.id}/series`);
        break;
      }
      case CATEGORY_TYPES.LIVE_TV: {
        Router.navigate(`live_tv/${this.id}`);
        break;
      }
      default:
        console.warn('unknown category type:', this.type);
    }
  }
}

export { Category };

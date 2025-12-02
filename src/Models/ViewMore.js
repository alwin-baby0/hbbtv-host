import { RAIL_TYPES, ROUTES } from '../constants/globalConstants';

class ViewMoreRailItem {
  constructor(item) {
    const { id, orientation } = item;
    this.id = id;
    this.orientation = orientation;
    this.type = RAIL_TYPES.VIEW_MORE;
    this.url = `${ROUTES.COLLECTION}/${this.id}`;
  }
}

export { ViewMoreRailItem };

import { RAIL_TYPES } from '../constants/globalConstants';
import { LiveChannelsRailItem } from './LiveChannelsRailItem';

class LiveEPGRailItem extends LiveChannelsRailItem {
  constructor(data) {
    super(data);
    const { id, title, type, media_group, summary } = data;

    this.id = id;
    this.title = title;
    this.type = type?.value;
    this.summary = summary;

    switch (this.type) {
      case RAIL_TYPES.LIVE_CHANNEL:
        this.url = ``;
        break;
      default:
        console.warn('unknown rail item type', this.type);
    }
  }
}

export { LiveEPGRailItem };

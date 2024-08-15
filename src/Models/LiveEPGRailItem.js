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
      case 'livechannel':
        this.url = ``;
        break;
      default:
        console.warn('unknown rail item type', this.type);
    }
  }
}

export { LiveEPGRailItem };

import { RAIL_TYPES } from '../constants/globalConstants';
import { SimpleRailItem } from './SimpleRailItem';

class LiveEventsRailItem extends SimpleRailItem {
  constructor(data) {
    super({ ...data, type: { value: RAIL_TYPES.EVENT } });
    const { meta, images, date, time } = data;
    const { summary, button_text } = meta;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let dateFormat = '';
    if (time) {
      const zeroDate = new Date(date + 'T' + time + 'Z');
      dateFormat = Intl.DateTimeFormat('en-US', {
        timeZone: timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(zeroDate);
    }

    this.dateWithTime = time && time !== '00:00:00' ? date + ': ' + dateFormat : date;
    this.description = summary;

    this.buttonText = button_text;

    this.landscapePosters = [];

    const landscapeKeysOriginal = Object.keys(images.landscape);
    const landscapeKeys = landscapeKeysOriginal.map((item) => `poster_landscape_${item}`);

    landscapeKeys.forEach((item, index) =>
      this.landscapePosters.push({
        key: item,
        src: images.landscape[landscapeKeysOriginal[index]],
      })
    );
  }

  getLandscapePoster() {
    return this.landscapePosters[2];
  }
}

export { LiveEventsRailItem };

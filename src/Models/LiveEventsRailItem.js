import { RAIL_TYPES } from '../constants/globalConstants';
import { SimpleRailItem } from './SimpleRailItem';

class LiveEventsRailItem extends SimpleRailItem {
  constructor(data) {
    super({ ...data, type: { value: RAIL_TYPES.EVENT } });
    const { meta, images, date, time } = data;
    const { summary, button_text } = meta;

    this.dateWithTime = date + ': ' + time;
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

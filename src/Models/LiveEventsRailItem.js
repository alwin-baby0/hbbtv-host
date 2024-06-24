import { SimpleRailItem } from './SimpleRailItem';

class LiveEventsRailItem extends SimpleRailItem {
  constructor(data) {
    super({ ...data, type: { value: 'event' } });
    const { extensions, media_group } = data;
    const { description, date_as_string_with_time, button_text } = extensions;

    this.dateWithTime = date_as_string_with_time;
    this.description = description;

    this.buttonText = button_text;

    this.landscapePosters = [];

    if (media_group) {
      media_group[0]?.media_item?.forEach((item) => {
        switch (true) {
          case item.key.includes('image'): {
            this.landscapePosters.push(item);
            break;
          }
          default:
            break;
        }
      });
    }
  }

  getLandscapePoster() {
    return this.landscapePosters[0];
  }
}

export { LiveEventsRailItem };

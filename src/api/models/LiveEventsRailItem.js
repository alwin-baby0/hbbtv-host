import { SimpleRailItem } from './SimpleRailItem';

class LiveEventsRailItem extends SimpleRailItem {
  constructor(data) {
    super({ ...data, type: { value: 'event' } });
    const { title, extensions, media_group } = data;
    const { description, date_as_string_with_time } = extensions;

    this.dateWithTime = date_as_string_with_time;
    this.title = title;
    this.description = description;

    this.buttonText = extensions.button_text;

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

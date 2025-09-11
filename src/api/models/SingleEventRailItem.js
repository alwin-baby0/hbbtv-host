import { LiveEventsRailItem } from './LiveEventsRailItem';

class SingleEventRailItem extends LiveEventsRailItem {
  constructor(data) {
    super(data);
    const { extensions, type, media_group } = data;
    this.content = {
      type: type.value,
      src: extensions.first_episode_mp4,
    };

    this.url = data.content.src;

    this.buttonLabel = extensions.button_text;
    this.description = extensions.description;
    this.extensions = extensions;
    const episodeCountTitle = `${extensions.date} - ${extensions.time} | ${extensions.venue}`;
    this.episodeCount = episodeCountTitle;

    this.landscapePosters = [];
    this.streamBanner = [];
    this.streamPlaceholder = [];
    this.banner = [];
    this.logo = [];

    if (media_group) {
      media_group[0]?.media_item?.forEach((item) => {
        switch (true) {
          case item.key.includes('stream_banner'): {
            this.streamBanner.push(item);
            break;
          }
          case item.key.includes('stream_placeholder'): {
            this.landscapePosters.push(item);
            break;
          }
          case item.key.includes('banner'): {
            this.banner.push(item);
            break;
          }
          case item.key.includes('logo'): {
            this.logo.push(item);
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

export default SingleEventRailItem;

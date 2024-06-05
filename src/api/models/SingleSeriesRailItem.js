import { SimpleRailItem } from './SimpleRailItem';

class SingleSeriesRailItem extends SimpleRailItem {
  constructor(data) {
    super(data);
    const { extensions, summary, type } = data;
    this.content = {
      type: type.value,
      src: extensions.first_episode_mp4,
    };
    this.description = extensions.description;
    this.episodeCount = summary;
    this.extensions = extensions;
  }
}

export default SingleSeriesRailItem;

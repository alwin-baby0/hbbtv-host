import { SimpleRailItem } from './SimpleRailItem';

class SingleSeriesRailItem extends SimpleRailItem {
  constructor(data) {
    super(data);
    const { extensions, summary } = data;

    this.description = extensions.description;
    this.episodeCount = summary;
    this.extensions = extensions;
  }
}

export default SingleSeriesRailItem;

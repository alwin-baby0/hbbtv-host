import { Lightning } from '@lightningjs/sdk';
import { VideoPlayer } from '@lightningjs/sdk';
import { loader, unloader } from '../../../components/Player/HLS';
import { EPGService } from '../../../Services';

export default class LiveTVPlayer extends Lightning.Component {
  static _template() {
    return {
      shader: { type: Lightning.shaders.RoundedRectangle, radius: 20 },
    };
  }

  _enable() {
    VideoPlayer.position(105, 1067);
    VideoPlayer.size(743, 415);
    VideoPlayer.consumer(this);
    VideoPlayer.loader(loader);
    VideoPlayer.unloader(unloader);
    VideoPlayer.loop(false);
  }

  _firstActive() {
    VideoPlayer.consumer(this);
  }

  _active() {
    this._changeChannel();
  }

  async _active() {
    this.fireAncestors('$punchHoleTV');
    VideoPlayer.pause();
  }

  _updateChannel(src) {
    VideoPlayer.clear();
    VideoPlayer.close();

    this.fireAncestors('$punchHoleTV');
    VideoPlayer.consumer(this);
    VideoPlayer.open(src);
  }

  _changeChannel(previousChannel) {
    const channelName = previousChannel.channelId ? previousChannel.channelId : previousChannel.id;
    EPGService.getSingleEPGChannel(channelName)
      .then((singleChannel) => {
        // Get the current time
        const currentTime = new Date();
        const matchingEntry = singleChannel.items.find((entry) => {
          const startTime = new Date(entry.extensions.start_time);
          const endTime = new Date(entry.extensions.end_time);

          return currentTime >= startTime && currentTime <= endTime;
        });

        if (matchingEntry) {
          const src = matchingEntry.content.src;

          // Update the channel using the matching entry's src
          this._updateChannel(src);
          this.fireAncestors('$updateChannelInfo', matchingEntry, singleChannel);
        }
      })
      .catch((error) => {
        console.error('Error occurred:', error);
      });
  }
}

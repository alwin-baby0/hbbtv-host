import { Lightning } from '@lightningjs/sdk';
import { VideoPlayer } from '@lightningjs/sdk';
import { loader, unloader, getPlayer } from '../../../components/Player/HLS';
import { EPGService } from '../../../Services';
import { Metrics } from '@firebolt-js/sdk';
import { getDeviceType } from '../../../utils/device';

export default class LiveTVPlayer extends Lightning.Component {
  static _template() {
    return {
      shader: { type: Lightning.shaders.RoundedRectangle, radius: 20 },
    };
  }

  _enable() {
    VideoPlayer.position(150, 1067);
    VideoPlayer.size(743, 415);
    VideoPlayer.consumer(this);
    VideoPlayer.loader(loader);
    VideoPlayer.unloader(unloader);
    VideoPlayer.loop(false);
  }

  _firstActive() {
    VideoPlayer.consumer(this);
  }

  async _active() {
    this._changeChannel();
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

  // True if this stream is already loaded and playing. With hls.js the <video> src is a blob: URL,
  // so the loaded source is read from the hls instance (null once the player is cleared/destroyed).
  // hls.js stores the url absolutised/normalised, so compare both forms; a miss just reloads.
  _isPlayingTheSameChannel(src) {
    if (!src || !VideoPlayer.playing) return false;
    const hls = getPlayer();
    const currentSrc = hls ? hls.url : VideoPlayer.src;
    if (!currentSrc) return false;
    if (currentSrc === src) return true;
    try {
      return currentSrc === new URL(src, window.location.href).href;
    } catch (e) {
      return false;
    }
  }

  _changeChannel(previousChannel) {
    const channelName = previousChannel?.channelId
      ? previousChannel.channelId
      : previousChannel?.id;
    EPGService.getSingleEPGChannel(channelName)
      .then((singleChannel) => {
        // Get the current time
        const currentTime = new Date();
        const matchingEntry = singleChannel?.items.find((entry) => {
          const startTime = new Date(entry.startTimeAll.ms);
          const endTime = new Date(entry.endTimeAll.ms);

          return currentTime >= startTime && currentTime <= endTime;
        });

        if (matchingEntry) {
          const src = previousChannel?.src;

          // Update the channel using the matching entry's src
          if (src) {
            // Don't restart the stream if this channel is already playing
            if (!this._isPlayingTheSameChannel(src)) this._updateChannel(src);
            this.fireAncestors('$updateChannelInfo', matchingEntry, singleChannel);
          }
        }
      })
      .catch((error) => {
        const deviceType = getDeviceType();
        deviceType === 'metrological' &&
          Metrics.error(
            Metrics.ErrorType.MEDIA,
            error.response ? error.response?.status.toString() : '400',
            'Error fetching channel',
            false
          );
        console.error('Error occurred:', error);
      });
  }
}

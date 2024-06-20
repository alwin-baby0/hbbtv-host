import { Colors, Router, Utils, VideoPlayer } from '@lightningjs/sdk';
import { ProgressBar, Row } from '@lightningjs/ui-components';
import { loader, unloader } from '../../components/Player/HLS';
import lng from '@lightningjs/core';
import colors from '../../../reskin/colors.json';
import HorizontalContainer from '../../components/HorizontalContainer/HorizontalContainer';
import PlayerButtons from './components/PlayerButtons/PlayerButtons';

export default class Player extends lng.Component {
  _props = {
    pausedItemId: 1,
  };

  static _template() {
    return {
      Wrapper: {
        h: 100,
        y: 750,
        w: 1920,
        ControlsWrapper: {
          h: 100,
          w: 1920,
          flex: { direction: 'row', alignItems: 'center' },
          Controls: {
            type: HorizontalContainer,
            h: 100,
            w: 1920,
            flex: { direction: 'row', alignItems: 'center' },
            rect: true,
            y: 0,
            color: Colors('#000000').alpha(0).get(),
          },
        },
        ProgressBarWrapper: {
          y: 100,
          w: 1920,
          flex: { flex: 'row', justifyContent: 'center', alignItems: 'center' },
          CurrentTime: {
            flex: { justifyContent: 'center', alignItems: 'center' },
            w: 150,
            h: 50,
            y: 8,
            color: Colors('#000').get(),
            Text: {
              flexItem: { alignSelf: 'center' },
              text: {
                text: '',
                fontSize: 30,
                textAlign: 'center',
              },
            },
          },
          ProgressBar: {
            type: ProgressBar,
            w: 1500,
          },
          EndTime: {
            flex: { justifyContent: 'center', alignItems: 'center' },
            w: 150,
            h: 50,
            y: 8,
            color: Colors('#000').get(),
            Text: {
              flexItem: { alignSelf: 'center' },
              text: {
                text: '00:00:00',
                fontSize: 30,
                textAlign: 'center',
              },
            },
          },
        },
      },
      ErrorMessage: {
        visible: false,
        color: Colors('#1e1e1e').get(),
        rect: true,
        w: 1920,
        h: 1080,
        flex: { direction: 'column', alignItems: 'center', justifyContent: 'center' },
        Image: {
          w: 890,
          h: 500,
          texture: lng.Tools.getSvgTexture(Utils.asset('loading-screen.svg'), 890, 500),
        },
        Message: {
          text: {
            text: 'There was a problem playing this video, please try again later or contact support at support@wedotv.com.',
            fontSize: 36,
            wordWrapWidth: 1200,
            textAlign: 'center',
          },
        },
      },
    };
  }

  get id() {
    return 'PlayerPage';
  }

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  get _Controls() {
    return this.tag('Controls');
  }

  set props(props) {
    const { controlsItems: items, liveItems } = props;
    const itemComponents = this._params.videoType === 'Stream now' ? liveItems : items;

    this._props.pausedItemId = this._params.videoType === 'Stream now' ? 1 : 2;

    const formattedItems = itemComponents.map((data) => ({
      type: PlayerButtons,
      props: {
        buttonInfo: data,
      },
    }));

    this._Controls.props = {
      items: formattedItems,
    };
  }

  set params({ videoUrl, videoType, type, duration }) {
    this._params = { videoUrl, videoType, type, duration };
  }

  _enable() {
    VideoPlayer.position(0, 0);
    VideoPlayer.size(1920, 1080);
    VideoPlayer.consumer(this);
    VideoPlayer.loader(loader);
    VideoPlayer.unloader(unloader);
    VideoPlayer.loop(false);
    VideoPlayer.mute();
  }

  _firstActive() {
    VideoPlayer.consumer(this);
  }

  async _checkVideoUrl(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Error fetching video URL: ${response.statusText}`);
        return false;
      }
      return true;
    } catch (error) {
      console.error(`Error fetching video URL: ${error.message}`);
      return false;
    }
  }

  _showErrorMessage() {
    this.tag('ErrorMessage').visible = true;
    this._hideWrapper();
    this.fireAncestors('$unpunchHole');
    clearInterval(this._progressInterval);
    VideoPlayer.close();
  }

  async _active() {
    if (this._params.videoType === 'Stream now') {
      this.tag('CurrentTime').patch({ text: { text: '' } });
    }

    if (!this._params.videoUrl) {
      this._showErrorMessage();
      return;
    }

    const isValid = await this._checkVideoUrl(this._params.videoUrl);

    if (!isValid) {
      this._showErrorMessage();
      return;
    }

    this.tag('ErrorMessage').visible = false;
    this._setState('Controls');
    this._showWrapper(true);

    const durationInSeconds = parseFloat(this._params.duration);
    const formattedDuration = this._formatDuration(durationInSeconds);
    this.tag('EndTime.Text').text =
      this._params.videoType === 'Stream now' ? '' : formattedDuration;

    this._duration = durationInSeconds;
    this.fireAncestors('$punchHole');
    VideoPlayer.open(this._params.videoUrl);

    if (this._params.videoType !== 'Stream now') {
      this._progressInterval = setInterval(this._updateProgressBar.bind(this), 500);
    }
  }

  _disable() {
    VideoPlayer.close();
    this.fireAncestors('$unpunchHole');
    clearInterval(this._progressInterval);
    this.tag('ProgressBar').progress = 0;
  }

  _skipVideo(offset) {
    const newTime = VideoPlayer.currentTime + offset;
    VideoPlayer.seek(newTime);
    this._showWrapper(); // Show wrapper on skip
    if (!VideoPlayer.playing) {
      VideoPlayer.play();
      this._Controls.items[this._props.pausedItemId]._Icon.patch({
        texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/commands/pause.svg'), 90, 90),
      });
    }
  }

  $skippingTime(time) {
    this._showWrapper();
    this._skipVideo(time);
  }

  _handleBack() {
    this._showWrapper();
    Router.back();
    VideoPlayer.close();
    clearInterval(this._progressInterval);
    this.fireAncestors('$unpunchHole');
  }

  $exitVideo() {
    this._showWrapper();
    if (this.tag('Wrapper').visible) {
      this._handleBack();
    }
  }

  $videoPlayerEnded() {
    this._showWrapper();
    this._handleBack();
  }

  $playVideo() {
    const { pausedItemId } = this._props;

    this._showWrapper();
    VideoPlayer.play();
    this._Controls.Items.children[pausedItemId]._Icon.patch({
      texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/commands/pause.svg'), 90, 90),
    });
  }

  $pauseVideo() {
    const { pausedItemId } = this._props;
    this._showWrapper();
    VideoPlayer.pause();

    this._Controls.Items.children[pausedItemId]._Icon.patch({
      texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/commands/play.svg'), 90, 90),
    });
  }

  $startStopVideo(isStopped) {
    this._showWrapper();
    if (this.tag('Wrapper').visible) {
      isStopped ? VideoPlayer.pause() : VideoPlayer.play();
    }
  }

  _updateProgressBar() {
    const currentTime = VideoPlayer.currentTime;
    const progress = currentTime / VideoPlayer.duration;
    this.tag('ProgressBar').progress = progress;
    const formattedTime =
      this._params.videoType === 'Stream now' ? 'Live' : this._formatTime(currentTime);
    this.tag('CurrentTime.Text').text = formattedTime;
  }

  _showWrapper() {
    this.tag('Wrapper').visible = true;
    clearTimeout(this._hideWrapperTimeout); // Clear previous timeout
    this._hideWrapperTimeout = setTimeout(() => this._hideWrapper(), 10000); // Set new timeout
  }

  _hideWrapper() {
    this.tag('Wrapper').visible = false;
    clearTimeout(this._hideWrapperTimeout);
  }

  _formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  _formatDuration(seconds) {
    return this._formatTime(seconds);
  }

  $videoPlayerPlaying() {
    this._updateProgressBar();
    const durationInSeconds = parseFloat(VideoPlayer.duration);
    const formattedDuration = this._formatDuration(durationInSeconds);
    const progressBarStyle = {
      progressColor: Colors(colors.focus).get(),
      barColor: this._params.videoType === 'Stream now' ? Colors(colors.focus).get() : undefined,
    };
    this.tag('ProgressBar').patch({ style: progressBarStyle });
    this.tag('EndTime.Text').text =
      this._params.videoType === 'Stream now' ? '' : formattedDuration;
    this._duration = durationInSeconds;
  }

  static _states() {
    return [
      class Controls extends this {
        _getFocused() {
          return this._Controls;
        }
      },
    ];
  }
}

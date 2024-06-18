import { Colors, Router, Utils, VideoPlayer } from '@lightningjs/sdk';
import { ProgressBar, Row } from '@lightningjs/ui-components';
import { loader, unloader } from '../../components/Player/HLS';
import lng from '@lightningjs/core';
import colors from '../../../reskin/colors.json';

export default class Player extends lng.Component {
  static _template() {
    return {
      Wrapper: {
        h: 100,
        y: 750,
        w: 1920,
        ControlsWrapper: {
          h: 100,
          w: 1920,
          Controls: {
            type: Row,
            h: 100,
            w: 1920,
            flex: {},
            rect: true,
            y: 0,
            x: 40,
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
                text: '00:00:00',
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

  set params({ videoUrl, videoType, type, duration }) {
    return (this._params = {
      videoUrl,
      videoType,
      type,
      duration,
    });
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

  _active() {
    if (this._params.videoUrl === '') {
      this.tag('ErrorMessage').visible = true;
      this._hideWrapper();
      this.fireAncestors('$unpunchHole');
      clearInterval(this._progressInterval);
      VideoPlayer.close();
      return;
    } else {
      this.tag('ErrorMessage').visible = false;
    }

    this._setState('Controls');
    this._showWrapper(true);

    const durationInSeconds = parseFloat(this._params.duration);
    const formattedDuration = this._formatDuration(durationInSeconds);
    this.tag('EndTime.Text').text = formattedDuration;

    this._duration = durationInSeconds;
    this.fireAncestors('$punchHole');

    VideoPlayer.open(this._params.videoUrl);

    // Start interval to update progress bar every 500ms
    this._progressInterval = setInterval(() => {
      this._updateProgressBar();
    }, 500);
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
    if (VideoPlayer.playing === false) {
      VideoPlayer.play();
      this._Controls.items[2]._Icon.patch({
        texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/pause.svg'), 60, 60),
      });
    }
  }

  $skippingTime(time) {
    const isVisible = this.tag('Wrapper').visible;
    if (isVisible) {
      this._skipVideo(time);
    } else {
      this._showWrapper();
    }
  }

  _handleBack() {
    Router.back();
    VideoPlayer.close();
    clearInterval(this._progressInterval);
    this.fireAncestors('$unpunchHole');
  }

  $exitVideo() {
    const isVisible = this.tag('Wrapper').visible;
    if (isVisible) {
      this._handleBack();
    } else {
      this._showWrapper();
    }
  }

  $videoPlayerEnded() {
    this._handleBack();
  }

  $playVideo() {
    this._showWrapper();
    VideoPlayer.play();
    console.log(VideoPlayer.duration);
    this._Controls.items[2]._Icon.patch({
      texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/pause.svg'), 60, 60),
    });
  }

  $pauseVideo() {
    this._showWrapper();
    VideoPlayer.pause();
    this._Controls.items[2]._Icon.patch({
      texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/play.svg'), 60, 60),
    });
  }

  $startStopVideo(isStopped) {
    const isVisible = this.tag('Wrapper').visible;

    if (isVisible) {
      if (isStopped) {
        VideoPlayer.pause();
      } else {
        VideoPlayer.play();
      }
    } else {
      this._showWrapper();
    }
  }

  _updateProgressBar() {
    // Get current playback time (in seconds)
    const currentTime = VideoPlayer.currentTime;
    // Calculate progress as a percentage
    const progress = currentTime / VideoPlayer.duration;
    // Update progress bar
    this.tag('ProgressBar').progress = progress;

    const formattedTime = this._formatTime(currentTime);
    this.tag('CurrentTime.Text').text = formattedTime;
  }

  _showWrapper() {
    this.tag('Wrapper').visible = true;
    // Schedule a timeout to hide the Wrapper after 10 seconds
    this._hideWrapperTimeout = setTimeout(() => {
      this._hideWrapper();
    }, 10000); // 10 seconds in milliseconds
  }

  _hideWrapper() {
    this.tag('Wrapper').visible = false;
    // Clear the timeout to prevent it from hiding the Wrapper if it's already visible
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  $videoPlayerPlaying() {
    // Update progress bar during playback
    this._updateProgressBar();
    const durationInSeconds = parseFloat(VideoPlayer.duration);
    const formattedDuration = this._formatDuration(durationInSeconds);
    this.tag('EndTime.Text').text = formattedDuration;
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

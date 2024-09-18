import { Colors, Router, Utils, VideoPlayer } from '@lightningjs/sdk';
import { Column, ProgressBar } from '@lightningjs/ui-components';
import { getPlayer, loader, unloader } from '../../Components/Player/HLS';
import lng from '@lightningjs/core';
import colors from '../../../reskin/colors.json';
import HorizontalContainer from '../../Components/HorizontalContainer/HorizontalContainer';
import PlayerButtons from './components/PlayerButtons/PlayerButtons';
import SubtitlesButtons from './components/SubtitlesButtons/SubtitlesButtons';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import { CMPService } from '../../Services/CMPService';
let lastIndex = 0;

export default class Player extends lng.Component {
  _props = {
    pausedItemId: 1,
    lastId: 0,
  };

  static _template() {
    return {
      Wrapper: {
        h: 100,
        y: 750,
        w: 1690,
        ControlsWrapper: {
          w: 1690,
          h: 100,
          x: 115,
          flex: { direction: 'row', alignItems: 'center' },
          Controls: {
            type: HorizontalContainer,
            h: 100,
            w: 1690,
            flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
            rect: true,
            y: 0,
            color: Colors('#000000').alpha(0).get(),
          },
        },
        ProgressBarWrapper: {
          w: 1670,
          x: 115,
          y: 100,
          flex: { flex: 'row', justifyContent: 'center', alignItems: 'center' },
          CurrentTime: {
            y: -2,
            flex: { justifyContent: 'center', alignItems: 'center' },
            w: 140,
            h: 35,
            // y: 8,
            color: Colors('#000').get(),
            Text: {
              w: 140,
              h: 35,
              flexItem: { alignSelf: 'center' },
              text: {
                text: '',
                fontSize: 30,
                textAlign: 'center',
                fontFace: 'Montserrat-Bold',
              },
            },
          },
          ProgressBar: {
            type: ProgressBar,
            w: 1400,
            flexItem: {
              marginLeft: 20,
              marginRight: 20,
            },
          },
          EndTime: {
            y: -2,
            flex: { justifyContent: 'center', alignItems: 'center' },
            // w: 120,
            w: 140,
            h: 35,
            color: Colors('#000').get(),
            Text: {
              flex: { justifyContent: 'center', alignItems: 'center' },
              h: 35,
              w: 140,
              text: {
                text: '00:00:00',
                fontSize: 30,
                textAlign: 'center',
                fontFace: 'Montserrat-Bold',
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
    const itemComponents =
      this._params.videoType === 'Stream now' || this._params.videoType === 'application/x-mpegURL'
        ? liveItems
        : items;

    this._props.pausedItemId =
      this._params.videoType === 'Stream now' || this._params.videoType === 'application/x-mpegURL'
        ? 1
        : 1;

    const formattedItems = itemComponents.map((data) => ({
      type: PlayerButtons,
      props: {
        buttonInfo: data,
      },
    }));

    if (
      this._params.videoType === 'Stream now' ||
      this._params.videoType === 'application/x-mpegURL'
    ) {
      this.tag('ProgressBarWrapper').patch({
        x: 180,
      });
    } else {
      this.tag('ProgressBarWrapper').patch({
        x: 115,
      });
    }
    this.tag('ProgressBar').patch({
      w:
        this._params.videoType === 'Stream now' ||
        this._params.videoType === 'application/x-mpegURL'
          ? 1550
          : 1400,
      x:
        this._params.videoType === 'Stream now' ||
        this._params.videoType === 'application/x-mpegURL'
          ? 0
          : 0,
      flexItem: {
        marginLeft:
          this._params.videoType === 'Stream now' ||
          this._params.videoType === 'application/x-mpegURL'
            ? 0
            : 20,
        marginRight:
          this._params.videoType === 'Stream now' ||
          this._params.videoType === 'application/x-mpegURL'
            ? 0
            : 20,
      },
    });

    this._Controls.props = {
      items: formattedItems,
      w: 1920,
    };

    this._Controls._setFocusedIndex(1);

    this._Controls.tag('Items').patch({
      w: 1690,
      flex: { direction: 'row', alignItems: 'center', justifyContent: 'space-between' },
    });

    if (
      this._params.videoType === 'Stream now' ||
      this._params.videoType === 'application/x-mpegURL'
    ) {
      this._Controls.tag('Items').patch({
        w: 1690,
        flex: { direction: 'row', alignItems: 'center', justifyContent: 'space-between' },
      });
    } else {
      this._Controls.tag('Items').patch({
        w: 1690,
        flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
      });
    }
    if (
      this._params.videoType === 'Stream now' ||
      this._params.videoType === 'application/x-mpegURL'
    ) {
      this.tag('Wrapper').patch({
        Back: undefined,
        SubtitlesButton: undefined,
      });
    } else {
      this.tag('Wrapper').patch({
        Back: {
          x: 115,
          type: PlayerButtons,
          props: {
            buttonInfo: {
              label: 'back',
              icon: `/icons/player/commands/back.svg`,
              onLiveContent: true,
              position: 60,
            },
          },
        },
      });
      this.tag('Wrapper').patch({
        SubtitlesButton: {
          x: 1715,
          type: PlayerButtons,
          props: {
            buttonInfo: {
              label: 'subtitles',
              icon: `/icons/player/commands/subtitles.svg`,
              onLiveContent: true,
              position: 60,
            },
          },
        },
      });
    }
  }

  set params({ videoUrl, videoType, type, duration, videoId }) {
    this._params = { videoUrl, videoType, type, duration, videoId };
    console.log(videoUrl);
    console.log('parami', this._params);
  }

  _enable() {
    VideoPlayer.position(0, 0);
    VideoPlayer.size(1920, 1080);
    VideoPlayer.consumer(this);
    VideoPlayer.loader(loader);
    VideoPlayer.unloader(unloader);
    VideoPlayer.loop(false);
    clearTimeout(this._hideWrapperTimeout); // Clear previous timeout
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

  async _showErrorMessage() {
    this.tag('ErrorMessage').visible = true;
    this._hideWrapper();
    this.fireAncestors('$unpunchHole');
    clearInterval(this._progressInterval);
    VideoPlayer.close();
  }

  async _active() {
    lastIndex = 0;
    if (
      this._params.videoType === 'Stream now' ||
      this._params.videoType === 'application/x-mpegURL'
    ) {
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

    const durationInSeconds = parseFloat(this._params.duration);
    const formattedDuration = this._formatDuration(durationInSeconds);
    this.tag('EndTime.Text').text =
      this._params.videoType === 'Stream now' || this._params.videoType === 'application/x-mpegURL'
        ? ''
        : formattedDuration;

    this._duration = durationInSeconds;
    this.fireAncestors('$punchHole');
    VideoPlayer.open(this._params.videoUrl);

    if (
      this._params.videoType !== 'Stream now' ||
      this._params.videoType !== 'application/x-mpegURL'
    ) {
      this._progressInterval = setInterval(this._updateProgressBar.bind(this), 500);
    }
    this._setState('Controls');
    this._showWrapper(true);
    this._setState('Controls');
  }

  _disable() {
    clearTimeout(this._hideWrapperTimeout); // Clear previous timeout
    CMPService.addRecentlyWatched(this._params.videoId, 'video', VideoPlayer.currentTime);
    VideoPlayer.close();
    this.fireAncestors('$unpunchHole');
    clearInterval(this._progressInterval);
    this.tag('ProgressBar').progress = 0;
    // this._hideWrapper();
  }

  _skipVideo(offset) {
    const newTime = VideoPlayer.currentTime + offset;
    VideoPlayer.seek(newTime);
    this._showWrapper(); // Show wrapper on skip
  }

  $setFocusOnItem(value) {
    if (value === true) {
      this._setState('Subtitles');
    } else {
      this._setState('Controls');
      this._showWrapper();
      this.patch({
        Subtitles: undefined,
      });
    }
  }

  $showSubtitles(val) {
    const player = getPlayer();
    const getTracks = player.subtitleTrackController.tracks;

    const offButton = {
      name: 'OFF',
      type: 'SUBTITLES',
    };

    let items;
    if (false) {
      // If all tracks are disabled, only use the 'OFF' track
      items = [
        {
          type: SubtitlesButtons,
          props: {
            // languageInfo: offTrack,
          },
          w: 250,
          h: 100,
        },
      ];
    } else {
      // Otherwise, include all tracks plus the 'OFF' track
      let newArray = [offButton, ...getTracks];

      items = newArray.map((language, index) => ({
        type: SubtitlesButtons,
        props: {
          languageInfo: language,
          index: index,
        },
        w: 250,
        h: 60,
      }));
    }

    // Patch the Subtitles section with the appropriate items
    this.patch({
      Subtitles: {
        w: 600,
        h: 1080,
        x: 1320,
        rect: true,
        color: Colors('#1B1C23').get(),
        zIndex: 5,
        Title: {
          x: 50,
          y: 70,
          text: {
            text: 'Subtitles',
            fontSize: 32,
          },
        },
        Languages: {
          // type: VerticalContainer,
          type: Column,
          items: items,
          props: {
            w: 600,
            h: 1080,
            items: items,
          },
        },
      },
    });
  }

  $setInitial() {
    this.tag('Subtitles.Languages').items[lastIndex]._selectButton();
    this.tag('Subtitles.Languages').selectedIndex = lastIndex;
  }

  $setFocus(id) {
    const { lastId } = this._props;

    if (typeof lastId !== 'undefined') {
      // Unselect the button of the last ID before setting a new one
      this.tag('Subtitles.Languages').items[lastIndex]._unselectButton();
    }
    // Set the new ID
    if (!id) {
      this.tag('Subtitles.Languages').items[0]._selectButton();
    } else {
      this.tag('Subtitles.Languages').items[id]._selectButton();
    }
    // Update the lastId variable with the current ID
    this._props.lastId = id;
    lastIndex = id;
  }

  $updateSubtitle(languageIndex) {
    const player = getPlayer();
    player.subtitleTrack = languageIndex;
  }

  $videoPlayerLoadedData() {
    const player = getPlayer();
    // Ensure player is not null or undefined
    if (player && player.subtitleTrackController) {
      // Set the subtitle track to -1 if the player and subtitleTrackController exist
      player.subtitleTrackController.subtitleTrack = -1;
    } else {
      console.error('Player or subtitleTrackController is not initialized.');
    }
  }

  $skippingTime(time) {
    this._showWrapper();
    this._skipVideo(time);
  }

  _handleBack() {
    this._showWrapper();
    VideoPlayer.clear();
    VideoPlayer.close();
    VideoPlayer.unloader(unloader);
    clearInterval(this._progressInterval);
    this.fireAncestors('$unpunchHole');
    Router.back();
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

    console.log('pausiran video', this._params.videoId, 'video', VideoPlayer.currentTime);

    CMPService.addRecentlyWatched(this._params.videoId, 'video', VideoPlayer.currentTime);

    this._Controls.Items.children[pausedItemId]._Icon.patch({
      texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/commands/play.svg'), 90, 90),
    });
  }

  $startStopVideo(isStopped) {
    this._showWrapper();
    if (this.tag('Wrapper').visible) {
      VideoPlayer.pause();
    }
  }

  _updateProgressBar() {
    const currentTime = VideoPlayer.currentTime;
    const progress = currentTime / VideoPlayer.duration;
    this.tag('ProgressBar').progress = progress;
    const formattedTime =
      this._params.videoType === 'Stream now' || this._params.videoType === 'application/x-mpegURL'
        ? 'Live'
        : this._formatTime(currentTime);
    this.tag('CurrentTime.Text').text = formattedTime;

    console.log(formattedTime);
    console.log(currentTime);
  }

  $changeFocusOnControl(val) {
    if (val === true) {
      this._setState('Controls');
    } else {
      this._setState('Back');
    }
  }

  _showWrapper() {
    this._setState('Controls');
    this.tag('Wrapper').visible = true;
    clearTimeout(this._hideWrapperTimeout); // Clear previous timeout
    this._hideWrapperTimeout = setTimeout(() => {
      if (this._getState() !== 'Subtitles') {
        // Check if the state is not Subtitles
        this._hideWrapper();
        this._setState('ProgressBar');
      }
    }, 5000); // Set new timeout
  }

  _hideWrapper() {
    if (this._getState() !== 'Subtitles') {
      this._setState('ProgressBar');
      this.tag('Wrapper').visible = false;
      clearTimeout(this._hideWrapperTimeout);
      this._Controls._setFocusedIndex(1);
    }
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
      barColor:
        this._params.videoType === 'Stream now' ||
        this._params.videoType === 'application/x-mpegURL'
          ? Colors(colors.focus).get()
          : undefined,
    };
    this.tag('ProgressBar').patch({ style: progressBarStyle });
    this.tag('EndTime.Text').text =
      this._params.videoType === 'Stream now' || this._params.videoType === 'application/x-mpegURL'
        ? ''
        : formattedDuration;
    this._duration = durationInSeconds;
  }

  // COMANDS
  _handleMediaPlayPause() {
    const { pausedItemId } = this._props;

    // Check the current playing state before toggling
    const isCurrentlyPlaying = VideoPlayer.playing;

    // Toggle play/pause
    VideoPlayer.playPause();

    // Show the UI elements when toggling play/pause
    this._showWrapper();

    // Update the icon based on the current state
    if (isCurrentlyPlaying) {
      // The video was playing, now it will be paused
      this._Controls.Items.children[pausedItemId]._Icon.patch({
        texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/commands/play.svg'), 90, 90),
      });
    } else {
      // The video was paused, now it will be playing
      this._Controls.Items.children[pausedItemId]._Icon.patch({
        texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/commands/pause.svg'), 90, 90),
      });
    }
  }

  _handleMediaRewind() {
    // console.log('MediaRewind ');
    this._showWrapper(); // Show the UI elements when video starts playing
    this._skipVideo(-10);
    VideoPlayer.play();
  }
  _handleMediaFastForward() {
    // console.log('MediaFastForward ');
    this._showWrapper(); // Show the UI elements when video starts playing
    this._skipVideo(10);
  }
  _handleMediaPlay() {
    // console.log('MediaPlay ');
    this._showWrapper(); // Show the UI elements when video starts playing
    VideoPlayer.play();
  }
  _handleMediaPause() {
    // console.log('MediaPause ');
    this._showWrapper(); // Show the UI elements when video starts playing
    VideoPlayer.pause();
  }
  _handleMediaStop() {
    // console.log('MediaStop ');
    Router.back();
    VideoPlayer.close();
  }
  //

  static _states() {
    return [
      class Controls extends this {
        _getFocused() {
          return this._Controls;
        }
        _handleLeft() {
          if (
            this._params.videoType === 'Stream now' ||
            this._params.videoType === 'application/x-mpegURL'
          ) {
            return;
          } else {
            this._setState('Back');
          }
        }
        _handleRight() {
          if (
            this._params.videoType === 'Stream now' ||
            this._params.videoType === 'application/x-mpegURL'
          ) {
            return;
          } else {
            this._setState('SubtitlesButton');
          }
        }
      },
      class Subtitles extends this {
        _getFocused() {
          return this.tag('Subtitles.Languages');
        }
      },

      class ProgressBar extends this {
        _getFocused() {
          return this.tag('ProgressBar');
        }

        _handleEnter() {
          const isCurrentlyPlaying = VideoPlayer.playing;

          if (isCurrentlyPlaying === false) {
            const { pausedItemId } = this._props;
            this._showWrapper();
            VideoPlayer.pause();

            this._Controls.Items.children[pausedItemId]._Icon.patch({
              texture: lng.Tools.getSvgTexture(
                Utils.asset('/icons/player/commands/play.svg'),
                90,
                90
              ),
            });
          }

          this._setState('Controls');
          this._showWrapper();
        }
      },

      class Back extends this {
        _getFocused() {
          return this.tag('Back');
        }

        _handleRight() {
          this._setState('Controls');
        }
      },

      class SubtitlesButton extends this {
        _getFocused() {
          return this.tag('SubtitlesButton');
        }

        _handleLeft() {
          this._setState('Controls');
        }
      },
    ];
  }
}

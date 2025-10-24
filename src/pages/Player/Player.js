import { Colors, Router, Utils, VideoPlayer, Lightning } from '@lightningjs/sdk';
import { Column } from '@lightningjs/ui-components';
import { getPlayer, loader, unloader } from '../../components/Player/HLS';
import colors from '../../../reskin/colors.json';
import HorizontalContainer from '../../components/HorizontalContainer/HorizontalContainer';
import PlayerButtons from './components/PlayerButtons/PlayerButtons';
import SubtitlesButtons from './components/SubtitlesButtons/SubtitlesButtons';
import ProgressBar from './components/ProgressBar/ProgressBar';
import { CMPService, t } from '../../Services';
import { eventTrackPayload } from '../../utils/device';
import {
  convertCueTimeToSeconds,
  formatTimeHMS,
  formatTimeMS,
  playerButtonsLive,
  playerButtonsVOD,
} from './utils';
import { EVENT_NAMES, LOCAL_STORAGE_KEYS, VIDEO_TYPES } from '../../constants/globalConstants';

const states = ['Controls', 'Subtitles', 'SkipButton', 'Back', 'SubtitlesButton'];

export default class Player extends Lightning.Component {
  _props = {
    pausedItemId: 1,
    isAdVisible: false,
    currentAd: null,
    skipTo: 0,
    ads: [],
  };

  _cumulativeTime = 0;
  _currentlySelectedItem = null;
  _adStarted = false;
  _currentAdTime = 1;
  _selectedTranslationIndex = 0;
  _videoSkipTimeSum = 0;
  _progressInterval = null;
  _debouncePlayVideoId;
  _debounceVideoStart;
  _debounceVideoPause;
  _isSkipping = false;
  _watchedAds = [];

  static _template() {
    return {
      w: 1920,
      h: 1080,
      x: 0,
      y: 0,
      Spinner: {
        x: (x) => x / 2,
        y: (y) => y / 2,
        w: 80,
        h: 80,
        texture: Lightning.Tools.getSvgTexture(Utils.asset('images/spinner.svg'), 80, 80),
        mount: 0.5,
        rotation: 0,
      },
      Backdrop: {
        rect: true,
        w: 1920,
        h: 500,
        y: 1080,
        mountY: 1,
        colorTop: Colors('#000000').alpha(0).get(),
        colorBottom: Colors('#000000').get(),
        visible: false,
      },
      Wrapper: {
        h: 100,
        y: 750,
        w: 1690,
        collision: true,
        visible: false,
        EpisodeTitleWrapper: {
          visible: false,
          w: 700,
          h: 100,
          y: -750,
          EpisodeBackdrop: {
            rect: true,
            w: 800,
            h: 150,
            colorBottom: Colors('#000000').alpha(0).get(),
            colorTop: Colors('#000000').alpha(0.5).get(),
            colorRight: Colors('#000000').alpha(0).get(),
          },
          Text: {
            w: 700,
            h: 100,
            x: 20,
            y: 20,
            text: {
              text: '',
              fontSize: 40,
              fontFace: 'Montserrat-Bold',
              color: Colors(colors.unfocus).get(),
            },
          },
        },
        ControlsWrapper: {
          w: 1690,
          h: 100,
          x: 115,
          flex: { direction: 'row', alignItems: 'center' },
          Controls: {
            type: HorizontalContainer,
            collision: true,
            h: 100,
            w: 1690,
            flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
            rect: true,
            y: 0,
            color: Colors('#000000').alpha(0).get(),
            props: {
              parentState: 'Controls',
            },
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
            props: {
              width: 1400,
              height: 10,
              flexItem: {
                marginLeft: 20,
                marginRight: 20,
              },
            },
          },
          EndTime: {
            y: -2,
            flex: { justifyContent: 'center', alignItems: 'center' },
            w: 140,
            h: 35,
            color: Colors('#000').get(),
            Text: {
              flex: { justifyContent: 'center', alignItems: 'center' },
              h: 35,
              w: 140,
              text: {
                text: '',
                fontSize: 30,
                textAlign: 'center',
                fontFace: 'Montserrat-Bold',
              },
            },
          },
        },
      },
      Subtitles: {
        w: 600,
        h: 1080,
        x: 1320,
        rect: true,
        visible: false,
        color: Colors('#1B1C23').get(),
        zIndex: 6,
        Title: {
          x: 50,
          y: 70,
          text: {
            fontSize: 32,
          },
        },
        Languages: {
          collision: true,
          type: Column,
          items: [],
          props: {
            w: 600,
            h: 1080,
            parentState: 'Subtitles',
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
          texture: Lightning.Tools.getSvgTexture(Utils.asset('loading-screen.svg'), 890, 500),
        },
        Message: {
          text: {
            text: t('no_stream'),
            fontSize: 36,
            wordWrapWidth: 1200,
            textAlign: 'center',
          },
        },
      },
    };
  }

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  get _Controls() {
    return this.tag('Controls');
  }

  get _Episode() {
    return this.tag('EpisodeTitleWrapper');
  }

  get _Back() {
    return this.tag('Back');
  }

  get _Backdrop() {
    return this.tag('Backdrop');
  }

  get _Subtitles() {
    return this.tag('Subtitles');
  }

  get _ProgressBarWrapper() {
    return this.tag('ProgressBarWrapper');
  }

  get _ProgressBar() {
    return this.tag('ProgressBar');
  }

  get _ErrorMessage() {
    return this.tag('ErrorMessage');
  }

  get _Spinner() {
    return this.tag('Spinner');
  }

  get _ProgressBarAd() {
    return this.tag('ProgressBarAd');
  }

  get _AdNumber() {
    return this.tag('AdNumber.Text');
  }

  get _TimerAd() {
    return this.tag('TimerAd.Text');
  }

  get _WrapperAd() {
    return this.tag('WrapperAd');
  }

  get _SubtitlesLanguages() {
    return this.tag('Subtitles.Languages');
  }

  get _CurrentTime() {
    return this.tag('CurrentTime.Text');
  }

  get _EndTime() {
    return this.tag('EndTime.Text');
  }

  get _SkipButton() {
    return this.tag('SkipButton');
  }

  get SubtitlesButton() {
    return this.tag('SubtitlesButton');
  }

  set params({ videoType, videoUrl, ssai, ...rest }) {
    console.log('here');
    this._Subtitles.patch({
      Title: {
        text: t('subtitles'),
      },
      Languages: {
        items: [
          {
            type: SubtitlesButtons,
            collision: true,
            props: {
              languageInfo: {
                name: t('off').toUpperCase(),
                type: 'SUBTITLES',
              },
              index: 0,
            },
            w: 250,
            h: 100,
          },
        ],
      },
    });

    this._selectedTranslationIndex = 0;

    VideoPlayer.position(0, 0);
    VideoPlayer.size(1920, 1080);
    VideoPlayer.consumer(this);
    VideoPlayer.loader(loader);
    VideoPlayer.unloader(unloader);
    VideoPlayer.loop(false);

    this._initSpinner();

    this.props = {
      ...this._props,
      ...rest,
      videoUrl,
      ads: ssai,
      pausedItemId: 1,
      isLive: videoType === VIDEO_TYPES.STREAM_NOW || videoType === 'application/x-mpegURL',
    };
  }

  set props(props) {
    this._props = props;
    const { isLive, videoUrl, continueTime, episodeTitle } = props;
    setTimeout(() => {
      const focusedColor = Colors(colors.focus).get();
      const margin = isLive ? 0 : 20;

      this._ProgressBarWrapper.patch({
        x: isLive ? 180 : 115,
        CurrentTime: {
          Text: {
            text: isLive ? 'Live' : '00:00:00',
          },
        },
        EndTime: {
          Text: {
            text: isLive ? '' : '00:00:00',
          },
        },
        ProgressBar: {
          x: 0,
          flexItem: {
            marginLeft: margin,
            marginRight: margin,
          },
          props: {
            width: isLive ? 1550 : 1400,
            progressColor: focusedColor,
            backgroundBarColor: isLive ? focusedColor : colors.unfocus,
          },
        },
      });

      episodeTitle &&
        episodeTitle !== '' &&
        this._Episode.patch({
          visible: true,
          EpisodeBackdrop: {
            visible: true,
          },
          Text: {
            text: episodeTitle,
          },
        });

      //video
      this.fireAncestors('$punchHole');
      VideoPlayer.open(videoUrl);
      if (continueTime)
        setTimeout(() => {
          VideoPlayer.seek(continueTime);
        }, 500);

      this._Controls.patch({
        w: 1690,
        flex: {
          direction: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
        props: {
          w: 1920,
          items: isLive ? playerButtonsLive : playerButtonsVOD,
          targetIndex: 1,
          parentState: 'Controls',
        },
      });

      this._Controls._setFocusedIndex(1);

      if (isLive) {
        this._Wrapper.patch({
          Back: undefined,
          SubtitlesButton: undefined,
        });
      } else {
        this._Wrapper.patch({
          Back: {
            x: 115,
            type: PlayerButtons,
            collision: true,
            props: {
              buttonInfo: {
                label: 'back',
                icon: `/icons/player/commands/back.svg`,
                onLiveContent: true,
                position: 60,
              },
              parentState: 'Back',
            },
          },
          // SubtitlesButton: {
          //   x: 1715,
          //   type: PlayerButtons,
          //   collision: true,
          //   props: {
          //     buttonInfo: {
          //       label: 'subtitles',
          //       icon: `/icons/player/commands/subtitles.svg`,
          //       onLiveContent: true,
          //       position: 60,
          //     },
          //     parentState: 'SubtitlesButton'
          //   },
          // },
          SubtitlesButton: undefined,
        });
      }
    }, 0);
  }

  _disable() {
    super._disable();
    clearTimeout(this._hideWrapperTimeout);
    clearTimeout(this._debounceVideoStart);
    clearTimeout(this._debounceVideoPause);
    clearInterval(this._progressInterval);
    if (this._adMonitoringInterval) {
      clearInterval(this._adMonitoringInterval);
    }
    clearInterval(this._progressAdInterval);

    VideoPlayer.clear();
    VideoPlayer.close();

    this.fireAncestors('$unpunchHole');
    this._ProgressBar.progress(0);
    this._props.isAdVisible = false;
    this._adStarted = false;
    this._currentAdTime = 1;
    this.patch({
      WrapperAd: undefined,
    });
  }

  _showErrorMessage() {
    this._ErrorMessage.visible = true;
    this._hideWrapper();
    this.fireAncestors('$unpunchHole');
    clearInterval(this._progressInterval);
    clearTimeout(this._debounceVideoStart);
    clearTimeout(this._debounceVideoPause);
    VideoPlayer.close();
  }

  _startMonitoringAds() {
    // Clear any existing interval to prevent duplicates
    if (this._adMonitoringInterval) {
      clearInterval(this._adMonitoringInterval);
    }

    // Start a new interval to check ad cue points
    this._adMonitoringInterval = setInterval(() => {
      if (VideoPlayer.playing) {
        this._checkAdCuePoints();
      }
    }, 1000); // Check every second
  }

  _updateProgressBarAd(duration, adIndex, adsLength) {
    if (this._Spinner.visible) return;
    const progress = (this._currentAdTime + 1) / duration;
    this._ProgressBarAd.progress(progress);

    this._AdNumber.text = 'Ad ' + adIndex + ' of ' + adsLength;

    const adTime = duration - this._currentAdTime;

    if (adTime > -1) {
      this._TimerAd.text = formatTimeMS(duration - this._currentAdTime);
    }

    if (this._currentAdTime + 1 <= duration) {
      this._currentAdTime += 0.1;
    } else {
      clearInterval(this._progressAdInterval);
      this._adStarted = false;
      this._currentAdTime = 1;
    }
  }

  _checkAdCuePoints() {
    this._cumulativeTime = 0;
    const currentTime = VideoPlayer.currentTime;

    const ssai_params = this._props.ads;

    // Check if `ssai` has a `slots` array
    if (ssai_params && Array.isArray(ssai_params.slots)) {
      // Iterate over each slot in the `slots` array
      ssai_params.slots.forEach((slot) => {
        // Iterate over each pod in the current slot
        slot.pods.forEach((pod) => {
          // Iterate over each ad in the current pod
          pod.ads.forEach((ad, index) => {
            const from = convertCueTimeToSeconds(ad.cue.from);
            const to = convertCueTimeToSeconds(ad.cue.to);
            if (
              currentTime - this._cumulativeTime >= from &&
              currentTime - this._cumulativeTime < to
            ) {
              if (this._props.currentAd !== ad) {
                const lastAd = pod.ads[pod.ads.length - 1];
                const lastAdTo = convertCueTimeToSeconds(lastAd.cue.to);
                const lastAdFrom = convertCueTimeToSeconds(lastAd.cue.from);
                this._props.skipTo = lastAdTo - lastAdFrom;

                this.patch({
                  WrapperAd: {
                    x: 0,
                    y: 0,
                    w: 1920,
                    Overlay: {
                      // Semi-transparent black background to simulate shadow/overlay
                      rect: true,
                      w: 1920,
                      h: 200,
                      y: 880,
                      color: 0x66000000, // Semi-transparent black (0x66 is the alpha)
                    },
                    ProgressBarAd: {
                      type: ProgressBar,
                      x: 20,
                      y: 1000,
                      props: {
                        width: 1880,
                        height: 10,
                        backgroundBarColor: Colors(colors.adProgress).get(),
                        progressColor: undefined,
                      },
                    },
                    AdIcon: {
                      x: 1835,
                      y: 20,
                      w: 65,
                      h: 65,
                      Icon: {
                        color: Colors(colors.adProgress).get(),
                        texture: Lightning.Tools.getSvgTexture(
                          Utils.asset('icons/ad-icon.svg'),
                          65,
                          65
                        ),
                      },
                    },
                    AdInfoContainer: {
                      x: 20,
                      y: 930,
                      w: 300,
                      h: 35,
                      flex: { direction: 'row', alignItems: 'center' },
                      AdNumber: {
                        w: 140,
                        Text: {
                          flex: { justifyContent: 'flex-start', alignItems: 'center' },
                          h: 35,
                          w: 140,
                          text: {
                            text: 'Ad 1 of 2',
                            fontSize: 28,
                            fontFace: 'Montserrat-SemiBold',
                            textColor: Colors('#ffffff').get(),
                            shadow: true,
                          },
                        },
                      },
                      TimerAd: {
                        w: 140,
                        Text: {
                          flex: { justifyContent: 'flex-start', alignItems: 'center' },
                          h: 35,
                          w: 140,
                          text: {
                            text: '',
                            fontSize: 28,
                            fontFace: 'Montserrat-SemiBold',
                            textColor: Colors('#ffffff').get(),
                            shadow: true,
                          },
                        },
                      },
                    },
                  },
                });

                if (ad.skipping_allowed) {
                  this._WrapperAd.patch({
                    SkipButton: {
                      type: HorizontalContainer,
                      props: {
                        w: 200,
                        h: 60,
                        parentState: 'SkipButton',
                      },
                      x: 1700,
                      y: 915,
                      w: 200,
                      h: 60,
                      rect: true,
                      texture: Lightning.Tools.getRoundRect(
                        200,
                        60,
                        3,
                        4,
                        Colors(colors.focus).get(),
                        true,
                        Colors(colors.background).get()
                      ),
                      flex: { direction: 'row', justifyContent: 'center', alignItems: 'center' },
                      Text: {
                        flexItem: { alignSelf: 'center' },
                        text: {
                          text: 'Skip',
                          fontFace: 'Montserrat-SemiBold',
                          fontSize: 28,
                        },
                      },
                    },
                  });
                }

                if (!this._adStarted) {
                  this._adStarted = true;

                  const duration = to - from;

                  this._updateProgressBarAd(duration, index + 1, pod.ads.length);

                  this._progressAdInterval = setInterval(
                    () => this._updateProgressBarAd(duration + 1, index + 1, pod.ads.length),
                    100
                  );
                }

                // Aktiviraj reklamu
                this._handleAdPlayback(ad);
                this._props.currentAd = ad; // Postavi trenutnu reklamu kao aktivnu
              }
            }

            // Provera da li je trenutna reklama završena
            if (currentTime - this._cumulativeTime >= to && this._props.currentAd === ad) {
              this._handleAdEnd(ad);

              //check if the current ad is the last ad in the pod
              if (ad === pod.ads[pod.ads.length - 1]) {
                this._handlePodEnd();
              }

              //check if the current pod is the last, and if the ad is the last in the pod
              if (pod === slot.pods[slot.pods.length - 1] && ad === pod.ads[pod.ads.length - 1]) {
                this._handleSlotEnd();
              }
              this._props.currentAd = null; // Oslobodi trenutnu reklamu
            }

            this._cumulativeTime += to - from;
          });
        });
      });
    } else {
      console.error('Invalid ssai structure or missing slots.');
      clearInterval(this._adMonitoringInterval);

      clearInterval(this._progressAdInterval);
      this._props.isAdVisible = false;
      this._adStarted = false;
      this._currentAdTime = 1;
      this.patch({
        WrapperAd: undefined,
      });
    }
  }

  _handleSlotEnd() {
    eventTrackPayload(EVENT_NAMES.AD_SLOT_ENDED, this._props.videoId);
  }
  _handlePodEnd() {
    eventTrackPayload(EVENT_NAMES.AD_POD_ENDED, this._props.videoId);
  }

  _handleAdEnd(ad) {
    // Logic to handle when the ad finishes
    console.log('Ad has finished:', ad.impression);

    eventTrackPayload(EVENT_NAMES.AD_ENDED, this._props.videoId);
    this._props.isAdVisible = false;
    clearInterval(this._progressAdInterval);
    this._adStarted = false;
    this._currentAdTime = 1;
    this.patch({
      WrapperAd: undefined,
    });
    this._setState('Controls');

    // Show player controls again or perform any other post-ad actions
  }

  _handleAdPlayback(ad) {
    eventTrackPayload(EVENT_NAMES.AD_SLOT_STARTED, this._props.videoId);
    eventTrackPayload(EVENT_NAMES.AD_POD_STARTED, this._props.videoId);

    this._hideWrapper();
    // Logic to handle ad playback, such as displaying the ad, hiding player controls, etc.
    console.log('Displaying Ad:', ad.impression);
    this._props.isAdVisible = true;
    if (!ad.skipping_allowed) {
      console.log('Skipping not allowed for this ad.');
      // Additional logic to disable skipping
    } else {
      this._setState('SkipButton');
    }
  }

  _handleHover(target) {
    if (target.ref && target.ref !== 'Wrapper') {
      return true;
    } else if (target.ref === 'Wrapper') {
      clearTimeout(this._hideWrapperTimeout);
      return true;
    }
  }

  _handleUnhover(target) {
    if (target.ref === 'Wrapper') {
      this._hideWrapperDebounce();
    }
    return true;
  }

  _skipVideo(forward) {
    this.$hideSbutitles();
    if (!this._props.isAdVisible) {
      this._isSkipping = true;
      if (forward) {
        this._videoSkipTimeSum += 20;
      } else {
        this._videoSkipTimeSum -= 20;
      }

      clearTimeout(this._seekTimeout);
      clearTimeout(this._debounceVideoStart);
      clearTimeout(this._debounceVideoPause);

      this._seekTimeout = setTimeout(() => {
        this._checkAdCuePointsSeek();
      }, 500);
    }
  }

  _checkAdCuePointsSeek() {
    const ssai_params = this._props.ads;
    const seekTime = Math.max(
      this._props.skipTo + 1,
      VideoPlayer.currentTime + this._videoSkipTimeSum
    );

    // Check if `ssai` has a `slots` array
    if (ssai_params && Array.isArray(ssai_params.slots)) {
      // Iterate over each slot in the `slots` array
      ssai_params.slots.forEach((slot) => {
        // Iterate over each pod in the current slot
        slot.pods.forEach((pod) => {
          // Iterate over each ad in the current pod
          pod.ads.forEach((ad, index) => {
            const from = convertCueTimeToSeconds(ad.cue.from);
            const to = convertCueTimeToSeconds(ad.cue.to);
            if (seekTime >= from && seekTime < to) {
              VideoPlayer.seek(from);
              this._videoSkipTimeSum = 0;
              VideoPlayer.play();
              return;
            }
          });
        });
      });
    }
    VideoPlayer.seek(seekTime);
    this._videoSkipTimeSum = 0;
    this.debouncePlayVideo();
  }

  debouncePlayVideo = () => {
    this._debouncePlayVideoId ?? clearTimeout(this._debouncePlayVideoId);
    this._debouncePlayVideoId = undefined;
    this._debouncePlayVideoId = setTimeout(() => {
      VideoPlayer.play();
    }, 500);
  };

  $hideSbutitles() {
    this._setState('Controls');
    this.getByRef('Subtitles').visible = false;
    this._subtitleMenuOpen = false;
  }

  $showSubtitles() {
    this.getByRef('Subtitles').visible = true;
    this._setState('Subtitles');
    this._subtitleMenuOpen = true;
  }

  $setInitial() {
    this._SubtitlesLanguages.items[this._selectedTranslationIndex]._selectButton();
    this._SubtitlesLanguages.selectedIndex = this._selectedTranslationIndex;
  }

  $setFocus(id) {
    this._SubtitlesLanguages.items[this._selectedTranslationIndex]._unselectButton();
    this._SubtitlesLanguages.items[id]._selectButton();
    this._SubtitlesLanguages.selectedIndex = id;
    this._selectedTranslationIndex = id;
  }

  $updateSubtitle(languageIndex) {
    const player = getPlayer();
    if (languageIndex === 0) player.subtitleTrack = undefined;

    player.subtitleTrack = languageIndex - 1;
  }

  $skippingTime(forward) {
    this._skipVideo(forward);
  }

  closeVideoPlayer() {
    clearTimeout(this._debounceVideoStart);
    clearTimeout(this._debounceVideoPause);
    VideoPlayer.clear();
    VideoPlayer.close();

    clearInterval(this._progressInterval);
    clearInterval(this._progressAdInterval);
    this._adStarted = false;
    this._currentAdTime = 1;
    this.patch({
      WrapperAd: undefined,
    });
    this.fireAncestors('$unpunchHole');
    Router.back();
  }

  handleBackHelper() {
    if (localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
      if (parseFloat(VideoPlayer.duration) > 300) {
        if (this._props.seriesID) {
          CMPService.addRecentlyWatched(
            this._props.videoId,
            'series',
            VideoPlayer.currentTime,
            this._props.seriesID
          );
        } else {
          CMPService.addRecentlyWatched(this._props.videoId, 'video', VideoPlayer.currentTime);
        }
      }
    }
  }

  _handleBack(e) {
    if (Router.isNavigating()) {
      return;
    }

    if (this._subtitleMenuOpen) {
      this.$hideSbutitles();
      return;
    }
    e.preventDefault();

    console.log('routerHistory in player back: ', Router.getHistory());
    const router = Router.getHistory().filter(
      (history) => history.hash != 'splash' && history.hash != 'cmp'
    );
    Router.setHistory([...router]);

    this.handleBackHelper();

    this.closeVideoPlayer();
  }

  $exitVideoFromBackClick() {
    this._showWrapper();

    if (this._Wrapper.visible) {
      this.handleBackHelper();
    }

    this.closeVideoPlayer();
  }

  $exitVideo(e) {
    if (this._Wrapper.visible) {
      this._handleBack(e);
    }
  }

  $playVideo() {
    if (!this._isSkipping && !VideoPlayer.playing) {
      const { pausedItemId, isLive } = this._props;

      this.$hideSbutitles();

      clearTimeout(this._debounceVideoPause);

      if (!this._props.isAdVisible) {
        if (isLive) {
          VideoPlayer.seek(VideoPlayer.duration);
          VideoPlayer.play();

          return;
        }
        VideoPlayer.play();
      }

      this._Controls.Items.children[pausedItemId]._Icon.patch({
        texture: Lightning.Tools.getSvgTexture(
          Utils.asset('/icons/player/commands/pause.svg'),
          90,
          90
        ),
      });
    }
  }

  $pauseVideo() {
    if (!this._isSkipping && VideoPlayer.playing) {
      const { pausedItemId } = this._props;

      clearTimeout(this._debounceVideoPause);
      this._debounceVideoPause = setTimeout(() => {
        eventTrackPayload(EVENT_NAMES.VIDEO_PAUSE, this._props.videoId);
      }, 500);

      this.$hideSbutitles();

      if (!this._props.isAdVisible) {
        VideoPlayer.pause();
      }

      this._Controls.Items.children[pausedItemId]._Icon.patch({
        texture: Lightning.Tools.getSvgTexture(
          Utils.asset('/icons/player/commands/play.svg'),
          90,
          90
        ),
      });
    }
  }

  $startStopVideo() {
    this._setState('Controls');
  }

  _updateProgressBar() {
    const { isLive } = this._props;

    const currentTime = Math.max(
      0,
      Math.min(
        VideoPlayer.currentTime + this._videoSkipTimeSum - this._props.skipTo,
        VideoPlayer.duration - this._props.skipTo
      )
    );
    const progress = currentTime / (VideoPlayer.duration - this._props.skipTo);

    if (isLive) {
      this._ProgressBar.progress(1);
    } else {
      this._ProgressBar.progress(progress);
    }

    if (!isLive) {
      this._CurrentTime.text = formatTimeHMS(currentTime);
    }
  }

  $changeFocusOnControl(val) {
    if (val === true) {
      this._setState('Controls');
    } else {
      this._setState('Back');
    }
  }

  _showWrapper() {
    if (!this._props.isAdVisible) {
      if (!this._progressInterval) {
        this._setState('Controls');
        this._Backdrop.visible = true;
        this._Wrapper.visible = true;
        this._updateProgressBar();
        if (!this._props.isLive) {
          this._progressInterval = setInterval(() => {
            this._updateProgressBar();
          }, 1000);
        }
      }
      clearTimeout(this._hideWrapperTimeout);
      this._hideWrapperDebounce();
    }
  }

  _hideWrapperDebounce() {
    this._hideWrapperTimeout = setTimeout(() => {
      if (this._getState() !== 'Subtitles') {
        this._hideWrapper();
      }
    }, 5000);
  }

  _hideWrapper() {
    this._Backdrop.visible = false;
    this._Wrapper.visible = false;
    if (!this._props.isLive) {
      clearInterval(this._progressInterval);
      this._progressInterval = null;
    }
    clearTimeout(this._hideWrapperTimeout);
    this._Controls._setFocusedIndex(1);
  }

  _initSpinner() {
    this._Spinner
      .animation({
        duration: 2,
        repeat: -1,
        actions: [{ p: 'rotation', v: { 0: 0, 1: 10 * Math.PI } }],
      })
      .start();
  }

  _showSpinner() {
    this._Spinner.visible = true;
  }

  _hideSpinner() {
    this._Spinner.visible = false;
  }

  $videoPlayerPlaying() {
    clearTimeout(this._debounceVideoStart);
    this._debounceVideoStart = setTimeout(() => {
      eventTrackPayload(EVENT_NAMES.VIDEO_START, this._props.videoId, this._props.seriesID);
    }, 1000);
  }

  $videoPlayerCanPlay() {
    this._hideSpinner();
  }

  $videoPlayerWaiting() {
    this._showSpinner();
  }

  $videoPlayerEnded() {
    CMPService.deleteRecentlyWatched(this._props.videoId);
    this.closeVideoPlayer();

    eventTrackPayload(EVENT_NAMES.VIDEO_END, this._props.videoId);
  }

  $videoPlayerSeeked() {
    this._isSkipping = false;

    const { pausedItemId } = this._props;

    this._Controls.Items.children[pausedItemId]._Icon.patch({
      texture: Lightning.Tools.getSvgTexture(
        Utils.asset('/icons/player/commands/pause.svg'),
        90,
        90
      ),
    });
  }

  $videoPlayerLoadedData() {
    this._startMonitoringAds();

    const formattedDuration = formatTimeHMS(parseFloat(VideoPlayer.duration));

    this._EndTime.text = this._props.isLive ? '' : formattedDuration;

    this._setState('Controls');
    this._showWrapper();

    // Get the available subtitle tracks
    const subtitleTracks = getPlayer()?.subtitleTrackController?.tracks;

    if (!subtitleTracks || subtitleTracks.length === 0) {
      return;
    }

    const items = subtitleTracks.map((language, index) => ({
      type: SubtitlesButtons,
      props: {
        languageInfo: language,
        index: index + 1,
      },
      w: 250,
      h: 60,
    }));

    this._SubtitlesLanguages.appendItems(items);
  }

  $videoPlayerError(e) {
    console.error('Error in the player: ', e);
    if (e.event.code === 20) return;
    this._ErrorMessage.patch({
      Message: {
        text: {
          text: t('no_stream'),
        },
      },
    });
    this._showErrorMessage();
  }

  $setState(newState) {
    if (this._getState() === 'Subtitles') {
      return;
    }

    this._setState(newState);
  }

  // COMANDS
  _handleMediaPlayPause() {
    const { pausedItemId } = this._props;

    // Check the current playing state before toggling
    const isCurrentlyPlaying = VideoPlayer.playing;

    // Toggle play/pause
    VideoPlayer.playPause();

    // Show the UI elements when toggling play/pause
    this.$hideSbutitles();

    // Update the icon based on the current state
    if (isCurrentlyPlaying) {
      // The video was playing, now it will be paused
      this._Controls.Items.children[pausedItemId]._Icon.patch({
        texture: Lightning.Tools.getSvgTexture(
          Utils.asset('/icons/player/commands/play.svg'),
          90,
          90
        ),
      });
    } else {
      // The video was paused, now it will be playing
      this._Controls.Items.children[pausedItemId]._Icon.patch({
        texture: Lightning.Tools.getSvgTexture(
          Utils.asset('/icons/player/commands/pause.svg'),
          90,
          90
        ),
      });
    }
  }

  _handleMediaRewind() {
    this.$hideSbutitles();
    this._skipVideo(false);
    VideoPlayer.play();
  }

  _handleMediaFastForward() {
    this.$hideSbutitles();
    this._skipVideo(true);
  }

  _handleMediaPlay() {
    this.$playVideo();
  }

  _handleMediaPause() {
    this.$pauseVideo();
  }

  _handleMediaStop() {
    this.$hideSbutitles();
    Router.back();
    VideoPlayer.close();
  }

  get id() {
    return 'PlayerPage';
  }

  _captureKey({ keyCode }) {
    const useKeyHandlers = !this._Wrapper.visible;
    if (this._getState() !== 'Subtitles') this._showWrapper();

    if (window.keyCodes[keyCode] === 'Back' && this._getState() !== 'Subtitles') return false;
    return useKeyHandlers;
  }

  $handleStateHover(index, stateName = null) {
    if (stateName) {
      this._setState(stateName);
      return;
    }
    this._setState(states[index]);
  }

  static _states() {
    return [
      class Controls extends this {
        _getFocused() {
          return this._Controls;
        }
        _handleLeft() {
          if (this._props.isLive) return;

          this._setState('Back');
        }
        _handleRight() {
          if (this._props.isLive) return;

          // this._setState('SubtitlesButton');
        }
      },
      class Subtitles extends this {
        _getFocused() {
          return this._SubtitlesLanguages;
        }
        _handleBack() {
          this.$hideSbutitles();
        }

        _handleRight() {
          return false;
        }

        _handleLeft() {
          return false;
        }
      },

      class SkipButton extends this {
        _getFocused() {
          return this._SkipButton;
        }

        _handleEnter() {
          VideoPlayer.seek(this._props.skipTo);
        }
      },

      class Back extends this {
        _getFocused() {
          return this._Back;
        }

        _handleRight() {
          this._setState('Controls');
        }
      },

      class SubtitlesButton extends this {
        _getFocused() {
          return this.SubtitlesButton;
        }

        _handleLeft() {
          this._setState('Controls');
        }
      },
    ];
  }
}

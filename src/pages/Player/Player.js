import { Colors, Router, Utils, VideoPlayer } from '@lightningjs/sdk';
import { Column, ProgressBar } from '@lightningjs/ui-components';
import { getPlayer, loader, unloader } from '../../Components/Player/HLS';
import lng from '@lightningjs/core';
import colors from '../../../reskin/colors.json';
import HorizontalContainer from '../../Components/HorizontalContainer/HorizontalContainer';
import PlayerButtons from './components/PlayerButtons/PlayerButtons';
import SubtitlesButtons from './components/SubtitlesButtons/SubtitlesButtons';
import { CMPService, parseTranslations } from '../../Services';
import { eventTrackPayload } from '../../utils/device';
import { convertCueTimeToSeconds, fakeAdsData, formatAds, formatTimeHMS, formatTimeMS, playerButtonsLive, playerButtonsVOD } from './utils';

let lastIndex = 0;
let offsetTime = 0;

export default class Player extends lng.Component {
  _translations;
  _props = {
    pausedItemId: 1,
    lastId: 0,
    isAdVisible: false,
    currentAd: null,
    skipTo: 0,
    ads: [],
  };
  _currentlySelectedItem = null;
  _adStarted = false;
  _currentAdTime = 1;

  static _template() {
    return {
      w: 1920,
      h: 1080,
      x: 0,
      y: 0,
      Wrapper: {
        h: 100,
        y: 750,
        w: 1690,
        visible: false,
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
          type: Column,
          items: [
            {
              type: SubtitlesButtons,
              props: {
                languageInfo: {
                  name: 'OFF',
                  type: 'SUBTITLES',
                },
                index: 0,
              },
              w: 250,
              h: 100,
            },
          ],
          props: {
            w: 600,
            h: 1080,
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

  set params({ videoType, videoUrl, ssai, ...rest }) {
    this._translations = parseTranslations();
    lastIndex = 0;

    VideoPlayer.position(0, 0);
    VideoPlayer.size(1920, 1080);
    VideoPlayer.consumer(this);
    VideoPlayer.loader(loader);
    VideoPlayer.unloader(unloader);
    VideoPlayer.loop(false);

    this.props = {
      ...this._props,
      ...rest,
      videoUrl,
      ads: formatAds(ssai),
      pausedItemId: 1,
      isLive: videoType === 'Stream now' || videoType === 'application/x-mpegURL'
    };
  }

  set props(props) {
    this._props = props;
    const { isLive, videoUrl, continueTime } = props;

    this.tag('CurrentTime.Text').text = isLive ? 'Live' : '00:00:00';
    this.tag('EndTime.Text').text = isLive ? '' : '00:00:00';

    //progress bar
    this.tag('ProgressBarWrapper').patch({
      x: isLive ? 180 : 115,
    });

    const focusedColor = Colors(colors.focus).get();
    const margin = isLive ? 0 : 20;
    this.tag('ProgressBar').patch({
      w: isLive ? 1550 : 1400,
      x: 0,
      flexItem: {
        marginLeft: margin,
        marginRight: margin
      },
      style: {
        progressColor: focusedColor,
        barColor: isLive ? focusedColor : undefined,
      }
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
        justifyContent: 'center'
      },
      props: {
        w: 1920,
        items: isLive ? playerButtonsLive : playerButtonsVOD,
        targetIndex: 1,
      }
    })

    this._Controls._setFocusedIndex(1);

    if (isLive) {
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

  _disable() {
    super._disable();
    clearTimeout(this._hideWrapperTimeout);
    clearInterval(this._progressInterval);
    if (this._adMonitoringInterval) {
      clearInterval(this._adMonitoringInterval);
    }
    clearInterval(this._progressAdInterval);

    VideoPlayer.clear();
    VideoPlayer.close();

    this.fireAncestors('$unpunchHole');
    this.tag('ProgressBar').progress = 0;
    this._props.isAdVisible = false;
    this._adStarted = false;
    this._currentAdTime = 1;
    this.patch({
      WrapperAd: undefined,
    });
  }

  _showErrorMessage() {
    this.tag('ErrorMessage').visible = true;
    this._hideWrapper();
    this.fireAncestors('$unpunchHole');
    clearInterval(this._progressInterval);
    VideoPlayer.close();
  }

  $videoPlayerError() {
    this.tag('ErrorMessage').patch({
      Message: {
        text: {
          text: this._translations?.no_stream || "Invalid Video URL",
        }
      }
    })
    this._showErrorMessage();
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
    const progress = this._currentAdTime / duration;
    this.tag('ProgressBarAd').progress = progress;

    this.tag('AdNumber.Text').text = 'Ad ' + adIndex + ' of ' + adsLength;

    const adTime = duration - this._currentAdTime;

    if (adTime > -1) {
      this.tag('TimerAd.Text').text = formatTimeMS(duration - this._currentAdTime);
    }

    if (this._currentAdTime <= duration) {
      this._currentAdTime++;
    } else {
      clearInterval(this._progressAdInterval);
      this._adStarted = false;
      this._currentAdTime = 1;
    }
  }

  _checkAdCuePoints() {
    const currentTime = VideoPlayer.currentTime;

    const ssai_params = this._props.ads;
    //const ssai_params = fakeAdsData;
    console.log('ssai_params: ', ssai_params);

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
            if (currentTime >= from && currentTime < to) {
              if (this._props.currentAd !== ad) {
                const lastAd = pod.ads[pod.ads.length - 1];
                const lastAdTo = convertCueTimeToSeconds(lastAd.cue.to);
                this._props.skipTo = lastAdTo;

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
                      w: 1880,
                      h: 10,
                      // progress: 0.3,
                    },
                    AdIcon: {
                      x: 1835,
                      y: 20,
                      w: 65,
                      h: 65,
                      Icon: {
                        color: Colors(colors.adProgress).get(),
                        texture: lng.Tools.getSvgTexture(Utils.asset('icons/ad-icon.svg'), 65, 65),
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
                  this.tag('WrapperAd').patch({
                    SkipButton: {
                      type: HorizontalContainer,
                      props: {
                        w: 200,
                        h: 60,
                      },
                      x: 1700,
                      y: 915,
                      w: 200,
                      h: 60,
                      rect: true,
                      texture: lng.Tools.getRoundRect(
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
                          // lineHeight: 25,
                          // letterSpacing: 2,
                        },
                      },
                    },
                  });
                }

                const progressBarStyle = {
                  progressColor: Colors(colors.adProgress).get(),
                  // barColor: Colors('#000000').get(),
                  barColor: undefined,
                };

                this.tag('ProgressBarAd').patch({ style: progressBarStyle });

                if (!this._adStarted) {
                  this._adStarted = true;

                  const duration = to - from;

                  // const progress = this._currentAdTime / duration;

                  // this.tag('ProgressBarAd').progress = progress;

                  // this._currentAdTime++;

                  this._updateProgressBarAd(duration, index + 1, pod.ads.length);

                  this._progressAdInterval = setInterval(
                    () => this._updateProgressBarAd(duration, index + 1, pod.ads.length),
                    1000
                  );
                }

                // Aktiviraj reklamu
                this._handleAdPlayback(ad);
                this._props.currentAd = ad; // Postavi trenutnu reklamu kao aktivnu
              }
            }

            // Provera da li je trenutna reklama završena
            if (currentTime >= to && this._props.currentAd === ad) {
              // console.log('Ad finished:', ad.impression);
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
    eventTrackPayload('ad_slot_ended', this._props.videoId);
  }
  _handlePodEnd() {
    eventTrackPayload('ad_pod_ended', this._props.videoId);
  }

  _handleAdEnd(ad) {
    // Logic to handle when the ad finishes
    console.log('Ad has finished:', ad.impression);

    eventTrackPayload('ad_ended', this._props.videoId);
    this._props.isAdVisible = false;
    // this.patch({
    //   SkipButton: undefined,
    // });
    clearInterval(this._progressAdInterval);
    this._adStarted = false;
    this._currentAdTime = 1;
    this.patch({
      WrapperAd: undefined,
    });
    this._setState('ProgressBar');

    // Show player controls again or perform any other post-ad actions
  }

  _handleAdPlayback(ad) {
    eventTrackPayload('ad_slot_started', this._props.videoId);
    eventTrackPayload('ad_pod_started', this._props.videoId);

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

  _skipVideo(forward) {
    if (!this._props.isAdVisible) {
      if (forward) {
        offsetTime += 10;
      } else {
        offsetTime -= 10;
      }

      clearTimeout(this._seekTimeout);

      this._seekTimeout = setTimeout(() => {
        this._checkAdCuePointsSeek();
      }, 500);
    }
  }

  _checkAdCuePointsSeek() {
    console.log('_checkAdCuePointsSeek')
    const ssai_params = this._props.ads;
    // const ssai_params = this._adData;
    // console.log('ssai_params: ', ssai_params);
    const seekTime = VideoPlayer.currentTime + offsetTime;

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
              console.log('SEEK:', from);
              offsetTime = 0;
              VideoPlayer.play();
              return;
            }
          });
        });
      });
    }
    VideoPlayer.seek(seekTime);
    console.log('SEEK:', seekTime);
    offsetTime = 0;
    VideoPlayer.play();
  }

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
    // Get the available subtitle tracks
    console.log('getPlayer()', getPlayer())
    const subtitleTracks = getPlayer()?.subtitleTrackController?.tracks;
    console.log('subtitleTracks', subtitleTracks)
    if (!subtitleTracks || subtitleTracks.length === 0) {
      return;
    }

    const items = subtitleTracks.map((language, index) => ({
      type: SubtitlesButtons,
      props: {
        languageInfo: language,
        index: index,
      },
      w: 250,
      h: 60,
    }));

    this.tag('Subtitles.Languages').appendItems(items);
  }

  $skippingTime(forward) {
    this._skipVideo(forward);
  }

  closeVideoPlayer() {
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

  _handleBack(e) {
    if (Router.isNavigating()) {
      return;
    }
    e.preventDefault();

    if (this._subtitleMenuOpen) {
      this.$hideSbutitles();
      return;
    }

    console.log('routerHistory in player back: ', Router.getHistory());
    const router = Router.getHistory().filter((history) => history.hash != 'splash');
    Router.setHistory([...router]);
    if (localStorage.getItem('userData')) {
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

    this.closeVideoPlayer();
  }

  $exitVideo(e) {
    if (this.tag('Wrapper').visible) {
      this._handleBack(e);
    }
  }

  $videoPlayerEnded() {
    CMPService.deleteRecentlyWatched(this._props.videoId);
    this.closeVideoPlayer();

    eventTrackPayload('video_end', this._props.videoId);
  }

  $playVideo() {
    const { pausedItemId } = this._props;

    this.$hideSbutitles();

    if (!this._props.isAdVisible) {
      VideoPlayer.play();
    }

    this._Controls.Items.children[pausedItemId]._Icon.patch({
      texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/commands/pause.svg'), 90, 90),
    });
  }

  $pauseVideo() {
    const { pausedItemId } = this._props;

    eventTrackPayload('video_pause', this._props.videoId);
    this.$hideSbutitles();

    if (!this._props.isAdVisible) {
      VideoPlayer.pause();
    }

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

    this._Controls.Items.children[pausedItemId]._Icon.patch({
      texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/commands/play.svg'), 90, 90),
    });
  }

  $startStopVideo(isStopped) {
    this._setState('Controls');
    if (this.tag('Wrapper').visible) {
      VideoPlayer.pause();
    }
  }

  _updateProgressBar() {
    const { isLive } = this._props;
    const currentTime = Math.max(
      0,
      Math.min(VideoPlayer.currentTime + offsetTime, VideoPlayer.duration)
    );
    const progress = currentTime / VideoPlayer.duration;
    this.tag('ProgressBar').progress = progress;
    if (!isLive) {
      this.tag('CurrentTime.Text').text = formatTimeHMS(currentTime);
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
        this.tag('Wrapper').visible = true;
        this._updateProgressBar();
        if (!this._props.isLive) {
          this._progressInterval = setInterval(() => this._updateProgressBar(), 1000);
        }
      }
      clearTimeout(this._hideWrapperTimeout);
      this._hideWrapperTimeout = setTimeout(() => {
        if (this._getState() !== 'Subtitles') {
          this._hideWrapper();
        }
      }, 5000);
    }
  }

  _hideWrapper() {
    this._setState('ProgressBar');
    this.tag('Wrapper').visible = false;
    if (!this._props.isLive) {
      clearInterval(this._progressInterval);
      this._progressInterval = null;
    }
    clearTimeout(this._hideWrapperTimeout);
    this._Controls._setFocusedIndex(1);
  }

  $videoPlayerPlaying() {
    eventTrackPayload('video_start', this._props.videoId);
  }

  $videoPlayerCanPlay() {
    console.log('videoPlayerCanPlay')
    const formattedDuration = formatTimeHMS(parseFloat(VideoPlayer.duration));

    this.tag('EndTime.Text').text = this._props.isLive ? '' : formattedDuration;

    this._startMonitoringAds();

    this._setState('Controls');
    this._showWrapper();
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

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  get _Controls() {
    return this.tag('Controls');
  }

  get _Back() {
    return this.tag('Back');
  }

  _captureKey() {
    this._showWrapper();
    return false;
  }

  static _states() {
    return [
      class Controls extends this {
        _getFocused() {
          return this._Controls;
        }
        _handleLeft() {
          if (this._props.isLive)
            return;

          this._setState('Back');
        }
        _handleRight() {
          if (this._props.isLive)
            return;

          this._setState('SubtitlesButton');
        }
      },
      class Subtitles extends this {
        _getFocused() {
          return this.tag('Subtitles.Languages');
        }
      },

      class SkipButton extends this {
        _getFocused() {
          return this.tag('SkipButton');
        }

        _handleEnter() {
          VideoPlayer.seek(this._props.skipTo);
        }
      },

      class ProgressBar extends this {
        _getFocused() {
          return this.tag('ProgressBar');
        }

        _handleEnter() {
          if (!VideoPlayer.playing) {
            const { pausedItemId } = this._props;

            VideoPlayer.pause();

            this._Controls.Items.children[pausedItemId]._Icon.patch({
              texture: lng.Tools.getSvgTexture(
                Utils.asset('/icons/player/commands/play.svg'),
                90,
                90
              ),
            });
          }

          if (!this._props.isAdVisible) {
            this._setState('Controls');
          }
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

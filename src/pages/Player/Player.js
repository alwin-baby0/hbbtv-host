// Player.js
import { Colors, Router, Utils, VideoPlayer } from '@lightningjs/sdk';
import { Column, ProgressBar, Shadow } from '@lightningjs/ui-components';
import { getPlayer, loader, unloader } from '../../Components/Player/HLS';
import lng from '@lightningjs/core';
import colors from '../../../reskin/colors.json';
import HorizontalContainer from '../../Components/HorizontalContainer/HorizontalContainer';
import PlayerButtons from './components/PlayerButtons/PlayerButtons';
import SubtitlesButtons from './components/SubtitlesButtons/SubtitlesButtons';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import { CMPService } from '../../Services/CMPService';
import { eventTrackPayload } from '../../utils/device';
let lastIndex = 0;
let offsetTime = 0;

const test = {
  adcues: {
    slots: [
      {
        slot: 'slot1',
        total_duration: 30,
        pods: [
          {
            pod: 'pod1',
            ads: [
              {
                impression: 'https://springserve.com/vast/ad1',
                cue: { from: '00:00:00', to: '00:00:15' },
                skipping_allowed: false,
              },
              // {
              //   impression: 'https://springserve.com/vast/ad2',
              //   cue: { from: '00:00:15', to: '00:00:30' },
              //   skipping_allowed: true,
              // },
            ],
          },
        ],
      },
      {
        slot: 'slot2',
        total_duration: 50,
        pods: [
          {
            pod: 'pod2',
            ads: [
              {
                impression: 'https://springserve.com/vast/ad3',
                cue: { from: '00:10:00', to: '00:10:30' },
                skipping_allowed: false,
              },
            ],
          },
          {
            pod: 'pod3',
            ads: [
              {
                impression: 'https://springserve.com/vast/ad4',
                cue: { from: '00:30:00', to: '00:30:20' },
                skipping_allowed: true,
              },
            ],
          },
        ],
      },
      {
        slot: 'slot3',
        total_duration: 25,
        pods: [
          {
            pod: 'pod4',
            ads: [
              {
                impression: 'https://springserve.com/vast/ad5',
                cue: { from: '01:00:00', to: '01:00:25' },
                skipping_allowed: false,
              },
            ],
          },
        ],
      },
      {
        slot: 'slot4',
        total_duration: 30,
        pods: [
          {
            pod: 'pod5',
            ads: [
              {
                impression: 'https://springserve.com/vast/ad6',
                cue: { from: '02:00:00', to: '02:00:30' },
                skipping_allowed: true,
              },
            ],
          },
        ],
      },
    ],
  },
};

export default class Player extends lng.Component {
  _props = {
    pausedItemId: 1,
    lastId: 0,
    isAdVisible: false,
    currentAd: null,
    skipTo: 0,
    ads: [], // Inicijalizuj kao prazan niz
  };

  _adStarted = false;
  _currentAdTime = 1;

  _adData = {
    slots: [
      {
        slot: 'slot1',
        total_duration: 10,
        pods: [
          {
            pod: 'pod1',
            ads: [
              {
                impression: 'https://springserve.com/vast/ad1',
                cue: {
                  from: '00:00:40',
                  to: '00:00:50',
                },
                skipping_allowed: true,
              },
              {
                impression: 'https://springserve.com/vast/ad2',
                cue: {
                  from: '00:00:50',
                  to: '00:01:00',
                },
                skipping_allowed: true,
              },
            ],
          },
        ],
      },
      // {
      //   slot: 'slot2',
      //   total_duration: 50,
      //   pods: [
      //     {
      //       pod: 'pod2',
      //       ads: [
      //         {
      //           impression: 'https://springserve.com/vast/ad3',
      //           cue: {
      //             from: '00:01:00',
      //             to: '00:01:10',
      //           },
      //           skipping_allowed: false,
      //         },
      //       ],
      //     },
      //     {
      //       pod: 'pod3',
      //       ads: [
      //         {
      //           impression: 'https://springserve.com/vast/ad4',
      //           cue: {
      //             from: '00:30:00',
      //             to: '00:30:20',
      //           },
      //           skipping_allowed: true,
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   slot: 'slot3',
      //   total_duration: 25,
      //   pods: [
      //     {
      //       pod: 'pod4',
      //       ads: [
      //         {
      //           impression: 'https://springserve.com/vast/ad5',
      //           cue: {
      //             from: '01:00:00',
      //             to: '01:00:25',
      //           },
      //           skipping_allowed: false,
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   slot: 'slot4',
      //   total_duration: 30,
      //   pods: [
      //     {
      //       pod: 'pod5',
      //       ads: [
      //         {
      //           impression: 'https://springserve.com/vast/ad6',
      //           cue: {
      //             from: '02:00:00',
      //             to: '02:00:30',
      //           },
      //           skipping_allowed: true,
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
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
                text: '',
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

  set params({ videoUrl, videoType, type, duration, videoId, continueTime, seriesID, ssai }) {
    this._params = { videoUrl, videoType, type, duration, videoId, continueTime, seriesID, ssai };
    // console.log('ssai', ssai);
    console.log('video_id:', videoId);
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

  setAdUI(value) {
    // console.log('SAKRIJ KONTROLEEE:', value);
    // this._props.isAdVisible = value;
  }

  //!
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

  // _checkAdCuePoints() {
  //   const currentTime = VideoPlayer.currentTime;

  //   // this._adData.forEach((slot) => {
  //   // this._params.ssai
  //   this._params.ssai.forEach((slot) => {
  //     slot.pods.forEach((pod) => {
  //       pod.ads.forEach((ad) => {
  //         const from = this._convertCueTimeToSeconds(ad.cue.from);
  //         const to = this._convertCueTimeToSeconds(ad.cue.to);
  //         if (currentTime >= from && currentTime < to) {
  //           console.log('Ad is playing:', ad.impression);
  //           console.log('Skipping allowed:', ad.skipping_allowed);
  //           // Perform any additional actions when ad is active
  //           this._handleAdPlayback(ad);
  //         }
  //       });
  //     });
  //   });
  // }

  _formatAdTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(1, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  _updateProgressBarAd(duration, adIndex, adsLength) {
    console.log('currentTime: ', this._currentAdTime);
    console.log('duration: ', duration);
    const progress = this._currentAdTime / duration;

    console.log('progress: ', progress);

    this.tag('ProgressBarAd').progress = progress;

    this.tag('AdNumber.Text').text = 'Ad ' + adIndex + ' of ' + adsLength;

    const adTime = duration - this._currentAdTime;

    if (adTime > -1) {
      const adTimeFormated = this._formatAdTime(duration - this._currentAdTime);
      this.tag('TimerAd.Text').text = adTimeFormated;
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

    const ssai_params = this._params.ssai;
    // const ssai_params = this._adData;
    console.log('ssai_params: ', ssai_params);

    // Check if `ssai` has a `slots` array
    if (ssai_params && Array.isArray(ssai_params.slots)) {
      // Iterate over each slot in the `slots` array
      ssai_params.slots.forEach((slot) => {
        // Iterate over each pod in the current slot
        slot.pods.forEach((pod) => {
          // Iterate over each ad in the current pod
          pod.ads.forEach((ad, index) => {
            const from = this._convertCueTimeToSeconds(ad.cue.from);
            const to = this._convertCueTimeToSeconds(ad.cue.to);
            if (currentTime >= from && currentTime < to) {
              if (this._props.currentAd !== ad) {
                const lastAd = pod.ads[pod.ads.length - 1];
                const lastAdTo = this._convertCueTimeToSeconds(lastAd.cue.to);
                // this._props.skipTo = to;
                this._props.skipTo = lastAdTo;
                // console.log('Ad is playing:', ad.impression);
                // console.log('Skipping allowed:', ad.skipping_allowed);

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
    eventTrackPayload('ad_slot_ended', this._params.videoId);
  }
  _handlePodEnd() {
    eventTrackPayload('ad_pod_ended', this._params.videoId);
  }

  _handleAdEnd(ad) {
    // Logic to handle when the ad finishes
    console.log('Ad has finished:', ad.impression);

    eventTrackPayload('ad_ended', this._params.videoId);
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
    // this._showWrapper();
  }

  _convertCueTimeToSeconds(cue) {
    const parts = cue.split(':');
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  }

  _handleAdPlayback(ad) {
    eventTrackPayload('ad_slot_started', this._params.videoId);
    eventTrackPayload('ad_pod_started', this._params.videoId);

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
  //!
  async _active() {
    this._startMonitoringAds();
    // this._params.ssai
    this._props.ads = this._adData; // Postavi ads iz niza
    // this._props.ads = this._params.ssai; // Postavi ads iz niza

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

    this.fireAncestors('$punchHole');
    VideoPlayer.open(this._params.videoUrl);
    console.log('this._params.videoUrl', this._params.videoUrl);
    //VideoPlayer.open('https://cdn-05.wedo.tv/04/hls/NVJE243JDKK1/video_segment000_part1.ts');
    //VideoPlayer.open('https://www.radiantmediaplayer.com/media/hls/discontinuity/playlist.m3u8');

    if (this._params.continueTime)
      setTimeout(() => {
        VideoPlayer.seek(this._params.continueTime);
      }, 500);
  }

  _disable() {
    clearTimeout(this._hideWrapperTimeout); // Clear previous timeout
    VideoPlayer.close();
    this.fireAncestors('$unpunchHole');
    clearInterval(this._progressInterval);
    this.tag('ProgressBar').progress = 0;
    if (this._adMonitoringInterval) {
      clearInterval(this._adMonitoringInterval);
    }

    clearInterval(this._progressAdInterval);
    this._props.isAdVisible = false;
    this._adStarted = false;
    this._currentAdTime = 1;
    this.patch({
      WrapperAd: undefined,
    });
  }

  _skipVideo(offset) {
    if (!this._props.isAdVisible) {
      offsetTime += offset;
      // VideoPlayer.pause();
      clearTimeout(this._seekTimeout);
      const newTime = VideoPlayer.currentTime + offsetTime;
      // VideoPlayer.seek(newTime);
      // Set a new timeout to delay the seek operation by 500ms
      this._seekTimeout = setTimeout(() => {
        // VideoPlayer.seek(newTime);
        // console.log('SEEK:', newTime);
        // offsetTime = 0;
        // VideoPlayer.play();

        this._checkAdCuePointsSeek(newTime);
      }, 500); // 500ms delay
      this._showWrapper(); // Show wrapper on skip
    }
  }

  _checkAdCuePointsSeek(seekTime) {
    const currentTime = seekTime;

    const ssai_params = this._params.ssai;
    //const ssai_params = this._adData;
    // console.log('ssai_params: ', ssai_params);

    // Check if `ssai` has a `slots` array
    if (ssai_params && Array.isArray(ssai_params.slots)) {
      // Iterate over each slot in the `slots` array
      ssai_params.slots.forEach((slot) => {
        // Iterate over each pod in the current slot
        slot.pods.forEach((pod) => {
          // Iterate over each ad in the current pod
          pod.ads.forEach((ad, index) => {
            const from = this._convertCueTimeToSeconds(ad.cue.from);
            const to = this._convertCueTimeToSeconds(ad.cue.to);
            if (currentTime >= from && currentTime < to) {
              VideoPlayer.seek(from);
              console.log('SEEK:', from);
              offsetTime = 0;
              VideoPlayer.play();
            } else {
              VideoPlayer.seek(currentTime);
              console.log('SEEK:', currentTime);
              offsetTime = 0;
              VideoPlayer.play();
            }
          });
        });
      });
    } else {
      VideoPlayer.seek(currentTime);
      console.log('SEEK:', currentTime);
      offsetTime = 0;
      VideoPlayer.play();
    }
  }

  $videoPlayerCanPlay() {
    this._setState('Controls');
    this._showWrapper(true);
    if (
      this._params.videoType !== 'Stream now' ||
      this._params.videoType !== 'application/x-mpegURL'
    ) {
      this._progressInterval = setInterval(() => this._updateProgressBar(), 1000);
    }
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

  // $showSubtitles(val) {
  //   const player = getPlayer();
  //   const getTracks = player.subtitleTrackController.tracks;

  //   const offButton = {
  //     name: 'OFF',
  //     type: 'SUBTITLES',
  //   };

  //   let items;
  //   if (false) {
  //     // If all tracks are disabled, only use the 'OFF' track
  //     items = [
  //       {
  //         type: SubtitlesButtons,
  //         props: {
  //           // languageInfo: offTrack,
  //         },
  //         w: 250,
  //         h: 100,
  //       },
  //     ];
  //   } else {
  //     // Otherwise, include all tracks plus the 'OFF' track
  //     let newArray = [offButton, ...getTracks];

  //     items = newArray.map((language, index) => ({
  //       type: SubtitlesButtons,
  //       props: {
  //         languageInfo: language,
  //         index: index,
  //       },
  //       w: 250,
  //       h: 60,
  //     }));
  //   }

  //   // Patch the Subtitles section with the appropriate items
  //   this.patch({
  //     Subtitles: {
  //       w: 600,
  //       h: 1080,
  //       x: 1320,
  //       rect: true,
  //       color: Colors('#1B1C23').get(),
  //       zIndex: 5,
  //       Title: {
  //         x: 50,
  //         y: 70,
  //         text: {
  //           text: 'Subtitles',
  //           fontSize: 32,
  //         },
  //       },
  //       Languages: {
  //         // type: VerticalContainer,
  //         type: Column,
  //         items: items,
  //         props: {
  //           w: 600,
  //           h: 1080,
  //           items: items,
  //         },
  //       },
  //     },
  //   });
  // }

  $showSubtitles(val) {
    const player = getPlayer();

    // Define the 'OFF' button once at the top of the function
    const offButton = {
      name: 'OFF',
      type: 'SUBTITLES',
    };

    if (!(player && player.subtitleTrackController && player.subtitleTrackController.tracks)) {
      console.error('Tracks or subtitleTrackController is not available.');

      // Patch the Subtitles section with only the 'OFF' button
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
            type: Column,
            items: [
              {
                type: SubtitlesButtons,
                props: {
                  languageInfo: offButton,
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
      });
      return; // Exit function after patching with 'OFF' only
    }

    // Get the available tracks
    const getTracks = player.subtitleTrackController.tracks;

    // Create an array with 'OFF' button and other available tracks
    let newArray = [offButton, ...getTracks];

    let items = newArray.map((language, index) => ({
      type: SubtitlesButtons,
      props: {
        languageInfo: language,
        index: index,
      },
      w: 250,
      h: 60,
    }));

    // Patch the Subtitles section with all available items
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

  closeVideoPlayer() {
    this._showWrapper();
    VideoPlayer.clear();
    VideoPlayer.close();
    // VideoPlayer.unloader(unloader);
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
    e.preventDefault();
    if (parseFloat(VideoPlayer.duration) > 300) {
      if (this._params.seriesID) {
        CMPService.addRecentlyWatched(
          this._params.videoId,
          'series',
          VideoPlayer.currentTime,
          this._params.seriesID
        );
      } else {
        CMPService.addRecentlyWatched(this._params.videoId, 'video', VideoPlayer.currentTime);
      }
    }
    this.closeVideoPlayer();
  }

  $exitVideo(e) {
    this._showWrapper();
    if (this.tag('Wrapper').visible) {
      this._handleBack(e);
    }
  }

  $videoPlayerEnded() {
    CMPService.deleteRecentlyWatched(this._params.videoId);
    this.closeVideoPlayer();

    eventTrackPayload('video_end', this._params.videoId);
  }

  $playVideo() {
    const { pausedItemId } = this._props;

    // eventTrackPayload('video_start', this._params.videoId);

    this._showWrapper();
    VideoPlayer.play();
    this._Controls.Items.children[pausedItemId]._Icon.patch({
      texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/commands/pause.svg'), 90, 90),
    });
  }

  $pauseVideo() {
    const { pausedItemId } = this._props;

    eventTrackPayload('video_pause', this._params.videoId);

    this._showWrapper();
    VideoPlayer.pause();

    // console.log('pausiran video', this._params.videoId, 'video', VideoPlayer.currentTime);
    // console.log('duzina videa', parseFloat(VideoPlayer.duration));

    if (parseFloat(VideoPlayer.duration) > 300) {
      if (this._params.seriesID) {
        CMPService.addRecentlyWatched(
          this._params.videoId,
          'series',
          VideoPlayer.currentTime,
          this._params.seriesID
        );
      } else {
        CMPService.addRecentlyWatched(this._params.videoId, 'video', VideoPlayer.currentTime);
      }
    }

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
    // const currentTime = VideoPlayer.currentTime;
    const currentTime = Math.max(
      0,
      Math.min(VideoPlayer.currentTime + offsetTime, VideoPlayer.duration)
    );
    const progress = currentTime / VideoPlayer.duration;
    this.tag('ProgressBar').progress = progress;
    const formattedTime =
      this._params.videoType === 'Stream now' || this._params.videoType === 'application/x-mpegURL'
        ? 'Live'
        : this._formatTime(currentTime);
    this.tag('CurrentTime.Text').text = formattedTime;

    const durationInSeconds = parseFloat(VideoPlayer.duration);
    const formattedDuration = this._formatDuration(durationInSeconds);

    this.tag('EndTime.Text').text =
      this._params.videoType === 'Stream now' || this._params.videoType === 'application/x-mpegURL'
        ? ''
        : formattedDuration;
    this._duration = durationInSeconds;

    // console.log(formattedTime);
    // console.log(currentTime);
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
    // this._setState('Controls');
    // this.tag('Wrapper').visible = true;
    // clearTimeout(this._hideWrapperTimeout); // Clear previous timeout
    // this._hideWrapperTimeout = setTimeout(() => {
    //   if (this._getState() !== 'Subtitles') {
    //     // Check if the state is not Subtitles
    //     this._hideWrapper();
    //     this._setState('ProgressBar');
    //   }
    // }, 5000); // Set new timeout
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
    const progressBarStyle = {
      progressColor: Colors(colors.focus).get(),
      barColor:
        this._params.videoType === 'Stream now' ||
        this._params.videoType === 'application/x-mpegURL'
          ? Colors(colors.focus).get()
          : undefined,
    };
    this.tag('ProgressBar').patch({ style: progressBarStyle });
    eventTrackPayload('video_start', this._params.videoId);
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
    if (!this._props.isAdVisible) {
      VideoPlayer.play();
    }
  }
  _handleMediaPause() {
    // console.log('MediaPause ');
    this._showWrapper(); // Show the UI elements when video starts playing
    if (!this._props.isAdVisible) {
      VideoPlayer.pause();
    }
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
          const isCurrentlyPlaying = VideoPlayer.playing;
          if (isCurrentlyPlaying === false) {
            const { pausedItemId } = this._props;
            // this._showWrapper();
            VideoPlayer.pause();

            this._Controls.Items.children[pausedItemId]._Icon.patch({
              texture: lng.Tools.getSvgTexture(
                Utils.asset('/icons/player/commands/play.svg'),
                90,
                90
              ),
            });
          }

          if (this._props.isAdVisible !== true) {
            this._setState('Controls');
            this._showWrapper();
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

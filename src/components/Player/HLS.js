import { VideoPlayer } from '@lightningjs/sdk';
import Hls from 'hls.js';
let player = null;
const defaults = {
  debug: false,
};
function handleUnrecoverableError(player, errorEvent) {
  if (VideoPlayer._consumer) {
    VideoPlayer._consumer.fire('$videoPlayerError', errorEvent, VideoPlayer.currentTime);
    VideoPlayer._consumer.fire('$videoPlayerEvent', 'Error', errorEvent, VideoPlayer.currentTime);
  }
  destroyPlayer();
}
const createPlayer = (options) => {
  if (!player) {
    player = new Hls({
      ...defaults,
      ...options,
      // autoStartLoad: true,
      // startPosition: -1,
      // debug: false,
      // maxBufferLength: 60,
      // maxMaxBufferLength: 600,
      // maxBufferHole: 0.5,
      // enableWorker: true,
      // enableSoftwareAES: true,
      // startLevel: 2,
      // lowLatencyMode: true,
      // abrEwmaFastLive: 5.0,
      // abrEwmaSlowLive: 10.0,
    });
    // Additional configuration if needed
  }
  return player;
};
const destroyPlayer = () => {
  if (player && player.destroy && player.destroy instanceof Function) {
    player.destroy();
    player = null;
  }
};
const unload = (videoEl) => {
  destroyPlayer();
  videoEl.removeAttribute('src');
  videoEl.load();
  //My code
  videoEl.removeAttribute('preload');
  videoEl.removeAttribute('buffer');
  videoEl.removeEventListener('progress', onProgress);
};
export const loader = (url, videoEl, options = {}) => {
  return new Promise((resolve) => {
    unload(videoEl);
    if (url.includes('m3u8')) {
      // HLS stream
      player = createPlayer(options);
      player.autoLevelCapping = options.autoLevelCapping || -1;
      player.on(Hls.Events.MANIFEST_PARSED, () => resolve());
      player.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.MEDIA_ERROR:
              switch (data.details) {
                case Hls.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR:
                  handleUnrecoverableError(player, event);
                  break;
                default:
                  player.recoverMediaError();
                  break;
              }
              break;
            case Hls.ErrorTypes.NETWORK_ERROR:
              switch (data.details) {
                case Hls.ErrorDetails.FRAG_LOAD_ERROR:
                  player.currentLevel = data.frag.start + data.frag.duration + 0.1;
                  break;
                case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
                  handleUnrecoverableError(player, event);
                  break;
                default:
                  player.startLoad();
                  break;
              }
              break;
            default:
              handleUnrecoverableError(player, event);
              break;
          }
        }
      });
      player.loadSource(url);
      player.attachMedia(videoEl);
    } else if (url.includes('.mp4')) {
      // MP4 video
      videoEl.src = url;
      videoEl.load();
      //Buffer change
      videoEl.preload = 'auto';
      videoEl.setAttribute('preload', 'auto');
      videoEl.setAttribute('buffer', '10');
      videoEl.addEventListener('progress', onProgress);
      resolve();
    }
  });
};
const onProgress = (event) => {
  const videoEl = event.target;
  // console.log('Buffer length:', videoEl.buffered.end(0) - videoEl.currentTime);
};
export const unloader = (videoEl) => {
  return new Promise((resolve) => {
    unload(videoEl);
    resolve();
  });
};

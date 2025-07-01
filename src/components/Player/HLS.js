// HLS.js
import { VideoPlayer } from '@lightningjs/sdk';
import Hls from 'hls.js';

export let player = null;

// Regular expressions to detect ad and media fragments
const adUrlPattern = /\/break_\d+\.ts$/i;

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
      debug: false,
      liveBackBufferLength: 30,
      enableWorker: false,
      maxBufferLength: 30,
      backBufferLength: 30,
      ...options,
    });
  }
  return player;
};

const destroyPlayer = () => {
  if (player && player.destroy instanceof Function) {
    player.destroy();
    player = null;
  }
};

export function getSubtitleTracks() {
  return player.subtitleTrackController.tracks || []; // Accessing the subtitle tracks
}

export function getPlayer() {
  return player;
}

const onFragmentChanged = (fragment) => {
  console.log('Fragment URL:', fragment.frag.url); // Ovo dodajemo radi debuggiranja URL-ova
  const fragmentUrl = fragment.frag.url;
  const hasAdUI =
    VideoPlayer._consumer && VideoPlayer._consumer.getAdUI && VideoPlayer._consumer.getAdUI();

  if (adUrlPattern.test(fragmentUrl) && !hasAdUI) {
    console.log('Ad fragment detected, showing ad UI');
    VideoPlayer._consumer && VideoPlayer._consumer.setAdUI && VideoPlayer._consumer.setAdUI(true);
  } else {
    console.log('Content fragment detected, hiding ad UI');
    VideoPlayer._consumer && VideoPlayer._consumer.setAdUI && VideoPlayer._consumer.setAdUI(false);
  }
};

export const loader = (url, videoEl, options = {}) => {
  return new Promise((resolve) => {
    unload(videoEl);

    if (url.includes('m3u8')) {
      player = createPlayer(options);
      player.autoLevelCapping = options.autoLevelCapping || -1;

      player.on(Hls.Events.MANIFEST_PARSED, () => {
        const subtitleTracks = getSubtitleTracks();
        resolve(subtitleTracks);
      });

      // Detect fragment change event in HLS.js
      player.on(Hls.Events.FRAG_CHANGED, (event, data) => {
        onFragmentChanged(data);
      });

      player.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          handleUnrecoverableError(player, event);
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
      videoEl.src = url;
      videoEl.load();
      //Buffer change
      videoEl.preload = 'auto';
      videoEl.setAttribute('preload', 'auto');
      videoEl.setAttribute('buffer', '10');
      resolve();
    }
  });
};

const unload = (videoEl) => {
  destroyPlayer();
  videoEl.removeAttribute('src');
  videoEl.load();
};

export const unloader = (videoEl) => {
  return new Promise((resolve) => {
    unload(videoEl);
    resolve();
  });
};

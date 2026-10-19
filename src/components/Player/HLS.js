import { VideoPlayer } from '@lightningjs/sdk';
import Hls from 'hls.js';
import { getDeviceType } from '../../utils/device';
import { Metrics } from '@firebolt-js/sdk';

export let player = null;

// Regular expressions to detect ad and media fragments
const adUrlPattern = /\/break_\d+\.ts$/i;

function handleUnrecoverableError(player, errorEvent) {
  if (VideoPlayer._consumer) {
    setTimeout(() => {
      const deviceType = getDeviceType();
      deviceType === 'metrological' &&
        Metrics.error(Metrics.ErrorType.NETWORK, 'Player error', 'Error in the player', true);
      VideoPlayer._consumer.fire('$videoPlayerError', errorEvent, VideoPlayer.currentTime);
      VideoPlayer._consumer.fire('$videoPlayerEvent', 'Error', errorEvent, VideoPlayer.currentTime);
    }, 1000)
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
      maxMaxBufferLength: 30,
      backBufferLength: 30,
      startLevel: 4,
      maxInitialBitrate: 15000000,
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

// Blocked fragments in a row (reset whenever any fragment buffers) before giving up
const BLOCKED_FRAGMENT_LIMIT = 10;

// Segment request blocked by the browser (e.g. the CDN sends no CORS headers). hls.js doesn't retry
// these: it marks the fragment as a gap and moves on, so the error never becomes fatal.
// - FRAG_LOAD_ERROR excludes real #EXT-X-GAP segments (those come as FRAG_GAP)
// - status 0 while online = blocked (status 0 while offline is retried by hls.js)
// Not using errorAction.retryCount: it sums errors over all levels and a buffered fragment only
// resets its own level, so it can accumulate across a long session.
const isBlockedFragmentError = (data) =>
  data.details === Hls.ErrorDetails.FRAG_LOAD_ERROR &&
  data.response?.code === 0 &&
  navigator.onLine !== false;

const reportBlockedFragment = (videoEl, data) => {
  if (!VideoPlayer._consumer) return;
  // Consumers read e.event.code, so pass an event object (not the hls event name)
  VideoPlayer._consumer.fire(
    '$videoPlayerError',
    {
      videoElement: videoEl,
      event: { code: 'FRAG_BLOCKED', details: data.details, url: data.frag && data.frag.url },
    },
    VideoPlayer.currentTime
  );
};

export const loader = (url, videoEl, options = {}) => {
  return new Promise((resolve) => {
    unload(videoEl);

    if (url.includes('m3u8')) {
      player = createPlayer(options);
      player.autoLevelCapping = options.autoLevelCapping || -1;
      let blockedFragmentReported = false;
      let blockedFragmentsInARow = 0;

      // Any buffered fragment means segments are loading again
      player.on(Hls.Events.FRAG_BUFFERED, () => {
        blockedFragmentsInARow = 0;
      });

      player.on(Hls.Events.MANIFEST_PARSED, () => {
        const subtitleTracks = getSubtitleTracks();
        player.subtitleTrack = 0;
        resolve(subtitleTracks);
      });

      // Detect fragment change event in HLS.js
      player.on(Hls.Events.FRAG_CHANGED, (event, data) => {
        onFragmentChanged(data);
      });

      player.on(Hls.Events.ERROR, (event, data) => {
        if (isBlockedFragmentError(data)) {
          blockedFragmentsInARow++;
          console.log(
            `### Blocked fragment ${blockedFragmentsInARow}/${BLOCKED_FRAGMENT_LIMIT}`,
            '| hls retryCount:',
            data.errorAction?.retryCount,
            '| fatal:',
            data.fatal,
            '| url:',
            data.frag && data.frag.url
          );
          // Fatal (e.g. no alternate level): hls.js has stopped, so report without waiting for the limit
          if (
            !blockedFragmentReported &&
            (data.fatal || blockedFragmentsInARow >= BLOCKED_FRAGMENT_LIMIT)
          ) {
            blockedFragmentReported = true;
            console.warn('HLS segments blocked (status 0, likely missing CORS):', data.frag && data.frag.url);
            player && player.stopLoad();
            reportBlockedFragment(videoEl, data);
          }
          return;
        }

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

export const unload = (videoEl) => {
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

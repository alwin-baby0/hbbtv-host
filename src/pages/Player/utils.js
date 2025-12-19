import { Metrics } from '@firebolt-js/sdk';
import { IMG_PATH } from '../../constants/globalConstants';
import PlayerButtons from './components/PlayerButtons/PlayerButtons';

export const playerButtonsVOD = [
  {
    type: PlayerButtons,
    collision: true,
    props: {
      buttonInfo: {
        label: 'backward',
        icon: IMG_PATH.FAST_BACKWARD_PLAYER,
        onLiveContent: false,
        position: 660,
      },
    },
  },
  {
    type: PlayerButtons,
    collision: true,
    props: {
      buttonInfo: {
        label: 'pause',
        icon: IMG_PATH.PAUSE_BTN_PLAYER,
        onLiveContent: true,
        position: 690,
      },
    },
  },
  {
    type: PlayerButtons,
    collision: true,
    props: {
      buttonInfo: {
        label: 'forward',
        icon: IMG_PATH.FAST_FORWARD_PLAYER,
        onLiveContent: false,
        position: 720,
      },
    },
  },
];

export const playerButtonsLive = [
  {
    type: PlayerButtons,
    collision: true,
    props: {
      buttonInfo: {
        label: 'back',
        icon: IMG_PATH.BACK_BTN_PLAYER,
        onLiveContent: true,
        position: 60,
      },
      isLive: true,
    },
  },
  {
    type: PlayerButtons,
    collision: true,
    props: {
      buttonInfo: {
        label: 'pause',
        icon: IMG_PATH.PAUSE_BTN_PLAYER,
        onLiveContent: true,
        position: 810,
      },
      isLive: true,
    },
  },
  {
    type: PlayerButtons,
    collision: true,
    props: {
      buttonInfo: {
        label: 'subtitles',
        icon: IMG_PATH.SUBTITLES,
        onLiveContent: true,
        position: 810,
      },
      isLive: true,
    },
  },
];

/**
 * Floors the number => Converts number to string => Pads to 2 digits
 * @param {number} number
 * @returns {string}
 */
const floorStringPad = (number) => Math.floor(number).toString().padStart(2, '0');

export const formatTimeMS = (seconds) => {
  const minutes = floorStringPad((seconds % 3600) / 60);
  const remainingSeconds = floorStringPad(seconds % 60);
  return `${minutes}:${remainingSeconds}`;
};

export const formatTimeHMS = (seconds) => {
  const hours = floorStringPad(seconds / 3600);
  const minutes = floorStringPad((seconds % 3600) / 60);
  const remainingSeconds = floorStringPad(seconds % 60);
  return `${hours}:${minutes}:${remainingSeconds}`;
};

/**
 * Check if video URL is valid
 * @param {string | undefined} url
 * @returns {boolean}
 */
export const isVideoURLValid = async (url) => {
  if (!url) return false;
  if (url.includes('mp4')) return true;
  try {
    const result = await fetch(url);
    return result.ok;
  } catch (e) {
    Metrics.error(Metrics.ErrorType.MEDIA, '400', 'Invalid video url', true);
    return false;
  }
};

export const convertCueTimeToSeconds = (cue) => {
  const parts = cue.split(':');
  return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
};

export const formatAds = (slots) => {
  return slots.map((slot) => {
    return slot.pods.map((pod) => {
      return {
        adStart: convertCueTimeToSeconds(pod.cue.from),
        adEnd: convertCueTimeToSeconds(pod.cue.to),
        skipAllowed: pod.skipping_allowed,
      };
    });
  });
};

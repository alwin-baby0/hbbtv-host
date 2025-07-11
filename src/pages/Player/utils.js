import PlayerButtons from "./components/PlayerButtons/PlayerButtons";

export const playerButtonsVOD = [
  // {
  //   type: PlayerButtons,
  //   props: {
  //     buttonInfo: {
  //       label: 'back',
  //       icon: `/icons/player/commands/back.svg`,
  //       onLiveContent: true,
  //       position: 60,
  //     },
  //   },
  // },
  {
    type: PlayerButtons,
    props: {
      buttonInfo: {
        label: 'backward',
        icon: `/icons/player/commands/fast-backward.svg`,
        onLiveContent: false,
        position: 660,
      },
    },
  },
  {
    type: PlayerButtons,
    props: {
      buttonInfo: {
        label: 'pause',
        icon: `/icons/player/commands/pause.svg`,
        onLiveContent: true,
        position: 690,
      },
    },
  },
  {
    type: PlayerButtons,
    props: {
      buttonInfo: {
        label: 'forward',
        icon: `/icons/player/commands/fast-forward.svg`,
        onLiveContent: false,
        position: 720,
      },
    },
  },
];

export const playerButtonsLive = [
  {
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
  {
    type: PlayerButtons,
    props: {
      buttonInfo: {
        label: 'pause',
        icon: `/icons/player/commands/pause.svg`,
        onLiveContent: true,
        position: 810,
      },
    },
  },
  {
    type: PlayerButtons,
    props: {
      buttonInfo: {
        label: 'subtitles',
        icon: `/icons/player/commands/subtitles.svg`,
        onLiveContent: true,
        position: 810,
      },
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
}

export const formatTimeHMS = (seconds) => {
  const hours = floorStringPad(seconds / 3600);
  const minutes = floorStringPad((seconds % 3600) / 60);
  const remainingSeconds = floorStringPad(seconds % 60);
  return `${hours}:${minutes}:${remainingSeconds}`;
}

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
    return false;
  }
}

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
      }
    })
  })
}

export const fakeAdsData = {
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

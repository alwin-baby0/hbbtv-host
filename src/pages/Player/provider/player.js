import PlayerButtons from '../components/PlayerButtons/PlayerButtons';
// TODO: refactor and create service to handle all the functionality for the player, move components in components folder
export const controlsItems = [
  // {
  //   label: 'back',
  //   icon: `/icons/player/commands/back.svg`,
  //   onLiveContent: true,
  //   position: 60,
  // },
  {
    label: 'backward',
    icon: `/icons/player/commands/fast-backward.svg`,
    onLiveContent: false,
    position: 660,
  },
  {
    label: 'pause',
    icon: `/icons/player/commands/pause.svg`,
    onLiveContent: true,
    position: 690,
  },
  {
    label: 'forward',
    icon: `/icons/player/commands/fast-forward.svg`,
    onLiveContent: false,
    position: 720,
  },
];
export const liveItems = [
  {
    label: 'back',
    icon: `/icons/player/commands/back.svg`,
    onLiveContent: true,
    position: 60,
  },
  {
    label: 'pause',
    icon: `/icons/player/commands/pause.svg`,
    onLiveContent: true,
    position: 810,
  },
  {
    label: 'subtitles',
    icon: `/icons/player/commands/subtitles.svg`,
    onLiveContent: true,
    position: 810,
  },
];
export default async function (page) {
  page.props = {
    controlsItems: controlsItems,
    liveItems: liveItems,
  };
}

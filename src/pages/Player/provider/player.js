import PlayerButtons from '../components/PlayerButtons/PlayerButtons';
const controlsItems = [
  {
    label: 'back',
    icon: `/icons/player/back.svg`,
    position: 60,
  },
  {
    label: 'backward',
    icon: `/icons/player/backward.svg`,
    position: 640,
  },
  {
    label: 'pause',
    icon: `/icons/player/pause.svg`,
    position: 670,
  },
  {
    label: 'forward',
    icon: `/icons/player/forward.svg`,
    position: 700,
  },
];
export default async function (page) {
  const items = controlsItems.map((data) => {
    return {
      type: PlayerButtons,
      props: {
        buttonInfo: data,
      },
    };
  });

  page._Controls.items = items;
}

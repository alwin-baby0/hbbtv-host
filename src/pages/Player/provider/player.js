import { VIDEO_PLAYER } from '../../../constants/globalConstants';
import PlayerButtons from '../components/PlayerButtons/PlayerButtons';
export const controlsItems = [
  {
    label: 'back',
    icon: VIDEO_PLAYER.BACK_BTN,
    onLiveContent: true,
    position: 60,
  },
  {
    label: 'backward',
    icon: VIDEO_PLAYER.FAST_BACKWARD,
    onLiveContent: false,
    position: 660,
  },
  {
    label: 'pause',
    icon: VIDEO_PLAYER.PAUSE_BTN,
    onLiveContent: true,
    position: 690,
  },
  {
    label: 'forward',
    icon: VIDEO_PLAYER.FAST_FORWARD,
    onLiveContent: false,
    position: 720,
  },
];
export const liveItems = [
  {
    label: 'back',
    icon: VIDEO_PLAYER.BACK_BTN,
    onLiveContent: true,
    position: 60,
  },
  {
    label: 'pause',
    icon: VIDEO_PLAYER.PAUSE_BTN,
    onLiveContent: true,
    position: 810,
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

  page.props = {
    controlsItems: controlsItems,
    liveItems: liveItems,
  };
}

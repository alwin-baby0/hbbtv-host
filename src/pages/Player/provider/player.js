import { IMG_PATH } from '../../../constants/globalConstants';
import PlayerButtons from '../components/PlayerButtons/PlayerButtons';
export const controlsItems = [
  {
    label: 'back',
    icon: IMG_PATH.BACK_BTN,
    onLiveContent: true,
    position: 60,
  },
  {
    label: 'backward',
    icon: IMG_PATH.FAST_BACKWARD,
    onLiveContent: false,
    position: 660,
  },
  {
    label: 'pause',
    icon: IMG_PATH.PAUSE_BTN,
    onLiveContent: true,
    position: 690,
  },
  {
    label: 'forward',
    icon: IMG_PATH.FAST_FORWARD,
    onLiveContent: false,
    position: 720,
  },
];
export const liveItems = [
  {
    label: 'back',
    icon: IMG_PATH.BACK_BTN,
    onLiveContent: true,
    position: 60,
  },
  {
    label: 'pause',
    icon: IMG_PATH.PAUSE_BTN,
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

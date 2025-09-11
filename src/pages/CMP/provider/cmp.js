import { Router } from '@lightningjs/sdk';
import Button from '../../../components/Button/Button';
import { CMPService } from '../../../Services';
import { getDeviceInfo } from '../../../utils/device';

export default async function (page, { movieId, url }) {
  await CMPService.initialFetch();

  const serialNumber = getDeviceInfo().serialNumber;

  const buttonsResult = CMPService.cmpData.buttons;

  const buttons = Object.values(buttonsResult).map((value, btnIndex) => {
    return {
      type: Button,
      collision: true,
      w: 1050,
      flexItem: {
        marginBottom: 18,
      },
      props: {
        width: 1050,
        height: 72,
        buttonLabel: value.label,
        buttonIcon: '',
        strokeWidth: 1.5,
        borderColor: '#696969',
        callback: async () => {
          if (value.callback_url) {
            const chosenValue = btnIndex === 0 ? 1 : 0;
            await CMPService.selectCMPChoice(serialNumber, chosenValue);
            console.log(url);
            console.log(movieId);
            if (url && movieId) {
              Router.navigate(`${url}/${movieId}`, { cmpShown: true });
            } else {
              Router.navigate('home', false);
            }
          } else {
            Router.navigate('cmp-customize', { options: value.options });
          }
        },
      },
    };
  });

  page.tag('Buttons').props = { items: buttons };
}

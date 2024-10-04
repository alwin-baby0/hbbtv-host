import { Router } from '@lightningjs/sdk';
import Button from '../../../Components/Button/Button';
import { CMPService } from '../../../Services/CMPService';

export default async function (page) {
  await CMPService.initialFetch();

  const serialNumber = localStorage.getItem('serialNumber');

  const buttonsResult = CMPService.cmpData.buttons;

  const buttons = Object.values(buttonsResult).map((value) => {
    return {
      type: Button,
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
            const chosenValue = value.label === 'Yes, I Agree' ? 1 : 0;
            await CMPService.selectCMPChoice(serialNumber, chosenValue);
            await Router.navigate('home');
          } else {
            Router.navigate('cmp-customize', { options: value.options });
          }
        },
      },
    };
  });

  page.tag('Buttons').props = { items: buttons };
}

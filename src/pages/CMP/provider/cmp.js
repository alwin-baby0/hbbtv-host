import { Router } from '@lightningjs/sdk';
import Button from '../../../Components/Button/Button';
import { CMPService } from '../../../Services/CMPService';

export default async function (page) {
  await CMPService.initialFetch();
  // console.log('CMP DATA:', CMPService.cmpData);

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
            console.log(value);
            const chosenValue = value.label === 'Yes, I Agree' ? 1 : 0;
            // CMPService.getCMPChoice('d9b02c2e-3e91-44bc-bd76-9e5f4ef91e09', chosenValue);
            await CMPService.selectCMPChoice('d9b02c2e-3e91-44bc-bd76-9e5f4ef91e09', chosenValue);

            // getCMPChoice('d9b02c2e-3e91-44bc-bd76-9e5f4ef91e09', chosenValue);
            // d9b02c2e-3e91-44bc-bd76-9e5f4ef91e09
          } else {
            Router.navigate('cmp-customize', { options: value.options });
          }
        },
      },
    };
  });

  page.tag('Buttons').props = { items: buttons };

  // const buttons =
  // if (CMPService.cmpData) {
  //   console.log('CMP DATA:', CMPService.cmpData);
  // } else {
  //   console.log('CMP data is still null or undefined');
  // }
}

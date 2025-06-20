import { Language, Lightning, Router } from '@lightningjs/sdk';
import QRCode from '../../../components/QRCode/QRCode';
import HorizontalContainer from '../../../components/HorizontalContainer/HorizontalContainer';
import VerticalContainer from '../../../components/VerticalContainer/VerticalContainer';
import Button from '../../../components/Button/Button';
const customizeButtons = [
  { id: 0, label: 'Refresh' },
  { id: 1, label: 'Close' },
];
export default class CMPCustomize extends Lightning.Component {
  static _template() {
    return {
      Wrapper: {
        w: 1920,
        y: 225,
        flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
        Title: {
          w: 1000,
          h: 50,
          text: {
            text: 'We value you privacy',
            fontSize: 40,
            fontFace: 'Montserrat-Bold',
            lineHeight: 50,
            textAlign: 'center',
          },
        },
        QRCodes: {
          w: 1050,
          h: 300,
          type: HorizontalContainer,
          props: {
            w: 1050,
            h: 300,
          },
        },
        Buttons: {
          w: 1050,
          h: 250,
          y: 75,
          collision: true,
          type: VerticalContainer,
        },
      },
    };
  }

  get _Titles() {
    return this.tag('Title');
  }

  get _QRCodes() {
    return this.tag('QRCodes');
  }

  get _Buttons() {
    return this.tag('Buttons');
  }

  set params({ options }) {
    this._params = { options };
    const qrCodes = options.map((qrCode) => {
      return {
        type: QRCode,
        // w: 910,
        w: 770,
        props: {
          qrCode,
        },
      };
    });

    this._Titles.patch({
      text: Language.translate('CMPTitle'),
    });

    const buttons = customizeButtons.map((button) => {
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
          // buttonLabel: button.label,
          buttonLabel: Language.translate(button.label),
          buttonIcon: '',
          strokeWidth: 1.5,
          borderColor: '#696969',
          callback: async () => {
            if (button.label === 'Close') {
              Router.back();
            } else {
              console.log('Refresh logic');
            }
          },
        },
      };
    });

    console.log('buttons', buttons);

    this._QRCodes.props = {
      items: qrCodes,
    };

    this._Buttons.props = {
      items: buttons,
    };
  }

  _getFocused() {
    return this._Buttons;
  }
}

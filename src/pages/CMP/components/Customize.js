import { Lightning } from '@lightningjs/sdk';
import QRCode from '../../../components/QRCode/QRCode';
import HorizontalContainer from '../../../Components/HorizontalContainer/HorizontalContainer';

export default class CMPCustomize extends Lightning.Component {
  static _template() {
    return {
      Wrapper: {
        w: 1920,
        y: 225,
        flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
        Title: {
          w: 450,
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
      },
    };
  }

  set params({ options }) {
    this._params = { options };
    const qrCodes = options.map((qrCode) => {
      return {
        type: QRCode,
        w: 910,
        props: {
          qrCode,
        },
      };
    });

    this.tag('QRCodes').props = {
      items: qrCodes,
    };
  }
}

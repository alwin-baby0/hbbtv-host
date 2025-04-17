import { Lightning } from '@lightningjs/sdk';

export default class QRCode extends Lightning.Component {
  static _template() {
    return {
      Wrapper: {
        w: 280,
        y: 75,
        flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
        QRImage: {
          w: 140,
          h: 140,
        },
        Title: {
          w: 280,
          y: 35,
          flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
          text: {
            fontFace: 'Montserrat-SemiBold',
            fontSize: 28,
            lineHeight: 35,
            textAlign: 'center',
          },
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };

    const { qrCode } = this._props;
    const { name, qr } = qrCode;

    this.tag('QRImage').patch({
      src: qr,
    });

    this.tag('Title').patch({
      text: {
        text: name,
      },
    });
  }

  static _states() {
    return [];
  }
}

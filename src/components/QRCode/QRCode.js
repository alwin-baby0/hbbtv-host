import { Lightning } from '@lightningjs/sdk';

export default class QRCode extends Lightning.Component {
  static _template() {
    return {
      Wrapper: {
        w: 280,
        flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
        QRImage: {
          w: 200,
          h: 200,
        },
        Title: {
          w: 280,
          y: 20,
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

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  get _QRImage() {
    return this.tag('QRImage');
  }

  get _Title() {
    return this.tag('Title');
  }

  set props(props) {
    this._props = { ...this._props, ...props };

    const { qrCode } = this._props;
    const { name, qr } = qrCode;

    this._Wrapper.patch({
      QRImage: {
        src: qr,
      },
      Title: {
        text: {
          text: name,
        },
      },
    });
  }
}

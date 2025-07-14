import { Lightning, Utils } from '@lightningjs/sdk';

export default class LiveChannelRailItem extends Lightning.Component {
  static _template() {
    return {
      zIndex: 100,
      w: 180,
      h: 95,
      Backg: {
        src: Utils.asset('images/Rectangle.png'),
        w: 180,
        h: 95,
        zIndex: 100,
      },
      Wrapper: {
        flex: { justifyContent: 'center', alignItems: 'center' },
        w: 180,
        h: 95,
        Icon: {
          zIndex: 100,
          w: 120,
          h: 75,
        },
      },
    };
  }

  set props(props) {
    const { icon } = props;
    this._Icon.patch({
      src: icon,
    });
  }

  get _Icon() {
    return this.tag('Icon');
  }
}

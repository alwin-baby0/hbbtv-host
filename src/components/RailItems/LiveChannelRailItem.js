import { Lightning, Utils, Router } from '@lightningjs/sdk';
import { IMG_PATH } from '../../constants/globalConstants';

export default class LiveChannelRailItem extends Lightning.Component {
  static _template() {
    return {
      zIndex: 100,
      w: 180,
      h: 95,
      Backg: {
        src: Utils.asset(IMG_PATH.LIVE_CHANNEL_BG),
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

  _handleHover() {
    if (!Router.isNavigating()) {
      Router.focusPage();
    }
    const { index } = this._props;
    this.fireAncestors('$handleItemHover', index);
    this._focus();
  }
}

import { Colors, Utils } from '@lightningjs/sdk';
import lng from '@lightningjs/core';
import colors from '../../../../../reskin/colors.json';

export default class PlayerButtons extends lng.Component {
  _props = {
    buttonInfo: {},
    isStopped: false,
  };
  static _template() {
    return {
      h: 100,
      w: 100,
      Button: {
        Icon: {},
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
  }

  get _Button() {
    return this.tag('Button');
  }

  get _Icon() {
    return this.tag('Icon');
  }

  _enable() {
    const { buttonInfo } = this._props;

    this._Icon.patch({
      x: buttonInfo.position,
      texture: lng.Tools.getSvgTexture(Utils.asset(buttonInfo.icon), 60, 60),
    });
  }

  _handleEnter() {
    const { buttonInfo, isStopped } = this._props;

    switch (buttonInfo.label) {
      case 'forward':
        this._props.isStopped = false;
        this.fireAncestors('$skippingTime', 30);
        this.fireAncestors('$startStopVideo', false);
        return;
      case 'backward':
        this.fireAncestors('$skippingTime', -30);
        this.fireAncestors('$startStopVideo', false);
        return;
      case 'pause':
        this._props.isStopped = !isStopped;
        if (this._props.isStopped) {
          this._Icon.patch({
            texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/play.svg'), 60, 60),
          });
          this.fireAncestors('$pauseVideo');
        } else {
          this._Icon.patch({
            texture: lng.Tools.getSvgTexture(Utils.asset('/icons/player/pause.svg'), 60, 60),
          });
          this.fireAncestors('$playVideo');
        }
        return;
      case 'back':
        this.fireAncestors('$exitVideo');
        return;
      default:
        return;
    }
  }

  _focus() {
    this._Icon.patch({
      color: Colors(colors.focus).get(),
    });
  }
  _unfocus() {
    this._Icon.patch({
      color: Colors(colors.unfocus).get(),
    });
  }
}

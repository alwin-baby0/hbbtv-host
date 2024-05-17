import { Colors } from '@lightningjs/sdk';
import Lightning from '@lightningjs/sdk/src/Lightning';
import colors from '../../../reskin/colors.json';

export default class FocusableItem extends Lightning.Component {
  _props = {
    width: 0,
    height: 0,
    radius: 6,
    strokeWidth: 4,
  };

  static _template() {
    return {
      FocusBorder: {
        x: -2,
        y: -2,
        zIndex: 100,
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };

    const { width, height } = this._props;

    this.tag('FocusBorder').patch({
      w: width,
      h: height,
    });
  }

  _focus() {
    const { radius, strokeWidth, width, height } = this._props;

    this.tag('FocusBorder').patch({
      texture: lng.Tools.getRoundRect(
        width + 2,
        height + 2,
        radius,
        strokeWidth,
        Colors(colors.focus).get(),
        false
      ),
    });
  }

  _unfocus() {
    this.tag('FocusBorder').patch({
      texture: null,
    });
  }
}

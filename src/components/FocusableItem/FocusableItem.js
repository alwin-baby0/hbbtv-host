import { Colors } from '@lightningjs/sdk';
import Lightning from '@lightningjs/sdk/src/Lightning';
import colors from '../../../reskin/colors.json';

export default class FocusableItem extends Lightning.Component {
  _props = {
    width: 0,
    height: 0,
    radius: 6,
    strokeWidth: 4,
    strokeColor: Colors(colors.focus).get(),
    zIndex: 100,
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

  get _FocusBorder() {
    return this.tag('FocusBorder');
  }

  setProps(props) {
    this._props = { ...this._props, ...props };

    const { zIndex, x, y } = this._props;

    this._FocusBorder.patch({
      x,
      y,
      // zIndex,
    });
  }

  _focus() {
    const { radius, strokeWidth, strokeColor, width, height } = this._props;

    this._FocusBorder.patch({
      texture: Lightning.Tools.getRoundRect(width, height, radius, strokeWidth, strokeColor, false),
    });
  }

  _unfocus() {
    this._FocusBorder.patch({
      texture: null,
    });
  }
}

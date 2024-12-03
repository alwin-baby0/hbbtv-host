// FocusableItem.js
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

  get _FocusBorder() {
    return this.tag('FocusBorder');
  }

  setProps(props) {
    this._props = { ...this._props, ...props };
  }

  _focus() {
    const { radius, strokeWidth, width, height } = this._props;

    setTimeout(() => {
      //setTimeout fix the issue of same item hover problem
      this._FocusBorder.patch({
        texture: lng.Tools.getRoundRect(
          width,
          height,
          radius,
          strokeWidth,
          Colors(colors.focus).get(),
          false
        ),
      });
      console.log('Focus applied:', this._FocusBorder);
    }, 0);
  }

  _unfocus() {
    this._FocusBorder.patch({
      texture: null,
    });
  }
}

import lng from '@lightningjs/core';
import { Colors, Utils } from '@lightningjs/sdk';

export default class ClearButton extends lng.Component {
  static _template() {
    return {
      h: 110,
      flex: { direction: 'column', alignItems: 'center', justifyContent: 'center' },
      Button: {
        collision: true,
        w: 75,
        h: 75,
        color: Colors('#42424200').get(),
        flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
        texture: lng.Tools.getRoundRect(
          75,
          75,
          37,
          3,
          Colors('#424242').get(),
          true,
          Colors('#424242').get()
        ),
        Icon: {},
      },
      Text: { y: 10 },
    };
  }

  set buttonProps(val) {
    return (this._buttonProps = val);
  }

  get Button() {
    return this.tag('Button');
  }

  get Icon() {
    return this.tag('Button.Icon');
  }

  get Text() {
    return this.tag('Text');
  }

  _enable() {
    this.patch({
      Button: {
        Icon: {
          texture: lng.Tools.getSvgTexture(
            Utils.asset(this._buttonProps?.icon),
            this._buttonProps.width ? this._buttonProps.width : 70,
            this._buttonProps.height ? this._buttonProps.height : 70
          ),
          color: Colors('#ffffff').get(),
        },
      },
      Text: {
        text: { text: this._buttonProps?.name || '', fontSize: 20, clipping: true },
      },
    });
  }

  _focus() {
    this.Button.patch({
      color: Colors('#606060').get(),
      flex: { alignItems: 'center' },
      texture: lng.Tools.getRoundRect(75, 75, 37, 3, false),
      Icon: {
        color: Colors('#ffffff').get(),
      },
    });
  }

  _unfocus() {
    this.Button.patch({
      color: Colors('#42424200').get(),
      texture: lng.Tools.getRoundRect(75, 75, 37, 3, false),
      Icon: {
        color: Colors('#ffffff').get(),
      },
    });
  }

  _handleHover() {
    this.fireAncestors('$setClearButtonState');
    this._focus();
  }

  _handleUnhover() {
    this._unfocus();
  }

  _handleClick() {
    this._handleEnter();
  }

  _handleEnter() {
    this.fireAncestors('$clearInput');
  }
}

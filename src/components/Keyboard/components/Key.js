import { Colors, Utils } from '@lightningjs/sdk';
import Lightning from '@lightningjs/sdk/src/Lightning';

export default class Key extends Lightning.Component {
  static _template() {
    return {
      collision: true,
      Key: {
        zIndex: 400,
        collision: true,
        rect: true,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 6 },
        color: Colors('#1b1b1b').alpha(0).get(),
        flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
        Title: {},
      },
    };
  }

  get _Key() {
    return this.tag('Key');
  }

  get _Title() {
    return this.tag('Key.Title');
  }

  set index(val) {
    this._index = val;
  }

  set rowIndex(val) {
    this._rowIndex = val;
  }

  set data({ w, h, key, icon }) {
    this._data = { w, h, key, icon };
  }

  _enable() {
    if (this._data.icon) {
      this._Title.patch({
        h: 60,
        w: 60,
        src: Utils.asset(`/icons/${this._data.icon}`),
      });
    } else {
      this._Title.patch({
        text: { text: this._data.key, fontSize: 30 },
      });
    }

    this.patch({
      w: this._data.w,
      h: this._data.h,
      Key: {
        w: this._data.w,
        h: this._data.h,
        color: this._rowIndex === 0 ? Colors('#383643').get() : '',
      },
    });
  }

  _focus() {
    this._Key.patch({
      zIndex: 500,
      w: this._data.w,
      h: this._data.h,
      color: Colors('#ffffff').get(),
      Title: {
        color: Colors('#000000').get(),
      },
    });
    this._Key.smooth = { scale: 1.2 };
  }

  _unfocus() {
    this._Key.patch({
      zIndex: 400,
      w: this._data.w,
      h: this._data.h,
      color: this._rowIndex === 0 ? Colors('#383643').get() : '',
      Title: {
        color: Colors('#ffffff').get(),
      },
    });
    this._Key.smooth = { scale: 1.0 };
  }

  _handleHover() {
    this.fireAncestors('$setFocusKey', { row: this._rowIndex, index: this._index });
    this._focus();
  }

  _handleEnter() {
    if (window.Didomi && window.didomiVisible) {
      return true;
    }

    this.fireAncestors('$onSoftKey', { key: this._data.key });
  }

  _handleClick() {
    this._handleEnter();
  }
}

import { Lightning, Colors, Utils } from '@lightningjs/sdk';
import { Key as BaseKey } from '@lightningjs/ui';
export class Key extends Lightning.Component {
  static _template() {
    return {
      Button: {
        collision: true,
        rect: true,
        w: 235,
        h: 75,
        color: Colors('#292929').get(),
        texture: Lightning.Tools.getRoundRect(235, 75, 12, 3, false),
        Wrapper: {
          flex: { justifyContent: 'center', alignItems: 'center' },
          Label: {
            x: (w) => w / 2,
            y: (h) => h / 2,
            mountY: 0.42,
            mountX: 0.5,
            alpha: 0.8,
            color: Colors('white').get(),
            text: { fontFace: 'Regular', fontSize: 32 },
          },
        },
        ButtonBorder: {},
      },
    };
  }

  get _Button() {
    return this.tag('Button');
  }

  set data(obj) {
    this._data = obj;
    this._update();
  }
  get data() {
    return this._data;
  }

  set index(val) {
    this._index = val;
  }

  _update() {
    if (!this.active) {
      return;
    }
    const { label } = this._data;
    this.patch({
      Label: {
        mountX: 0.5,
        x: (w) => w - 55,
        mountY: 0.5,
        y: (h) => h / 2,
        flex: { justifyContent: 'center', alignItems: 'center' },
        text: { text: label, fontSize: 32 },
      },
    });
  }
  _firstActive() {
    this._update();
  }
  _handleHover() {
    this.fireAncestors('$setFocus', this._index);
    this._focus();
  }

  _handleUnhover() {
    this._unfocus();
  }

  _handleClick() {
    this.fireAncestors('$BtnClicked');
  }
  _focus() {
    super._focus();
    this._Button.patch({
      color: Colors('#C40000').get(),
    });
  }
  _unfocus() {
    super._unfocus();
    this._Button.patch({
      color: Colors('#292929').get(),
    });
  }
}

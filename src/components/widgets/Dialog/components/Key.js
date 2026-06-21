import { Lightning, Colors } from '@lightningjs/sdk';
export class Key extends Lightning.Component {
  _paddingLeft = 25
  _paddingTop = 15
  _paddingRight = 25
  _paddingBottom = 15

  static _template() {
    return {
      Button: {
        collision: true,
        rect: true,
        color: Colors('#292929').get(),
        flex: { justifyContent: 'center', alignItems: 'center' },
        Label: {
          alpha: 0.8,
          color: Colors('white').get(),
          text: { fontFace: 'Montserrat-Regular', fontSize: 32 },
        },
      },
    };
  }

  get _Button() {
    return this.tag('Button');
  }

  get _Label() {
    return this.tag('Label');
  }

  set data(obj) {
    this._data = obj;
    this._update();
  }

  set index(val) {
    this._index = val;
  }

  get data() {
    return this._data;
  }

  _update() {
    if (!this.active) {
      return;
    }
    const { label } = this._data;
    this.patch({
      Button: {
        Label: {
          text: {
            text: label,
            fontSize: 32,
            textAlign: 'center',
          },
        }
      },
    });
  }

  _onTxLoadedHandler = () => {
    const keyWidth = this._Label.texture.getRenderWidth() + this._paddingLeft + this._paddingRight
    const keyHeight = this._Label.texture.getRenderHeight() + this._paddingTop + this._paddingBottom
    this.patch({
      w: keyWidth,
      h: keyHeight,
      Button: {
        texture: Lightning.Tools.getRoundRect(keyWidth, keyHeight, 12, 3, false)
      }
    })
  }

  _init() {
    this._Label.on('txLoaded', this._onTxLoadedHandler);
  }

  _active() {
    this._update();
  }

  _focus() {
    super._focus();
    this._Button.patch({
      color: Colors('#C40000').get(),
    });
    this.setSmooth('scale', 1.02)
  }

  _unfocus() {
    super._unfocus();
    this._Button.patch({
      color: Colors('#292929').get(),
    });
    this.setSmooth('scale', 1)
  }

  _handleClick() {
    this.fireAncestors('$handleEnter');
  }

  _handleHover() {
    this.fireAncestors('$setIndex', this._index);
    this._focus();
  }

  _handleBack() {
    this.fireAncestors('$handleBack');
  }

  _handleUnhover() {
    this._unfocus();
  }
}

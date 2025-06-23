import { Lightning, Colors } from '@lightningjs/sdk';
export class Key extends Lightning.Component {
  static _template() {
    return {
      Button: {
        collision: true,
        rect: true,
        w: 235,
        h: 75,
        color: Colors('#292929').get(),
        texture: lng.Tools.getRoundRect(235, 75, 12, 3, false),
        Wrapper: {
          Label: {
            w: 235,
            h: 75,
            alpha: 0.8,
            color: Colors('white').get(),
            text: { fontFace: 'Montserrat-Regular', fontSize: 32 },
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
      Label: {
        w: 235,
        h: 75,
        flex: { justifyContent: 'center', alignItems: 'center' },
        Text: {
          text: {
            text: label,
            fontSize: 32,
            textAlign: 'center',
            wordWrapWidth: 220,
          },
        },
      },
    });
  }
  _active() {
    this._update();
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

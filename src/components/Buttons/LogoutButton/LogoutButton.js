import { Colors, Lightning } from '@lightningjs/sdk';
import colors from '../../../../reskin/colors.json';

export default class LogoutButton extends Lightning.Component {
  _props = {
    label: '',
    callback: () => { },
  };

  static _template() {
    return {
      FocusBorder: {
        collision: true,
        flex: { direction: 'row', alignItems: 'center' },
        flexItem: {
          marginBottom: 30,
          marginTop: 30,
          marginLeft: 50,
          marginRight: 50,
        },
        w: (w) => w + 16,
        h: 80,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 12 },
        Column: {
          flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
          h: 65,
          w: (w) => w,
          x: 8,
          rect: true,
          shader: { type: Lightning.shaders.RoundedRectangle, radius: 12 },
          Text: {
            text: {
              color: Colors(colors.white).get(),
              fontFace: 'Montserrat-Bold',
              textAlign: 'center',
              verticalAlign: 'center',
            },
          },
        },
      },
    };
  }

  _active() {
    setTimeout(() => {
      this.stage.once('frameStart', () => {
        this._FocusBorder.patch({
          w: this._Text.finalW + 116,
          Column: {
            w: this._Text.finalW + 100,
          },
        });
      });
    });
  }

  get _Text() {
    return this.tag('Text');
  }

  get _FocusBorder() {
    return this.tag('FocusBorder');
  }

  set props(props) {
    const { items, ...rest } = props;
    this._props = { ...this._props, ...rest };
    const { label, fontSize } = this._props;

    this._FocusBorder.patch({
      Column: {
        color: Colors(colors.unfocusedLanguage).alpha(0).get(),
        Text: {
          text: {
            text: label,
            fontSize,
          },
        },
      },
    });
  }

  async _handleEnter() {
    if (window.Didomi && window.didomiVisible) {
      return true;
    }

    const { callback } = this._props;
    callback();
  }

  _focus() {
    setTimeout(
      () =>
        this._FocusBorder.patch({
          texture: Lightning.Tools.getRoundRect(
            this._Text.finalW + 116,
            80,
            12,
            4,
            Colors(colors.focus).get(),
            false
          ),
          Column: {
            color: Colors(colors.focus).get(),
          },
        }),
      200
    );
  }

  _unfocus() {
    setTimeout(() =>
      this._FocusBorder.patch({
        texture: Lightning.Tools.getRoundRect(
          this._Text.finalW + 116,
          80,
          12,
          4,
          Colors(colors.background).alpha(0).get(),
          false
        ),
        Column: {
          color: Colors(colors.unfocusedLanguage).alpha(0).get(),
        },
      })
    );
  }

  _handleHover() {
    this._focus();
    this.fireAncestors(
      '$handleStateHover',
      this.parent.children.indexOf(this),
      this._props.parentState
    );
  }

  _handleClick() {
    const { callback } = this._props;
    callback();
  }
}

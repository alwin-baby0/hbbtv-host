import { Colors, Lightning } from '@lightningjs/sdk';
import colors from '../../../../reskin/colors.json';

export default class LogoutButton extends Lightning.Component {
  _props = {
    label: '',
    callback: () => {},
  };

  static _template() {
    return {
      FocusBorder: {
        collision: true,
        flex: { direction: 'row', alignItems: 'center' },
        flexItem: {
          marginBottom: 20,
        },
        texture: Lightning.Tools.getRoundRect(
          260,
          75,
          12,
          4,
          Colors('#000000').alpha(0).get(),
          false
        ),
        Column: {
          h: 65,
          w: 250,
          x: 8,
          rect: true,
          shader: { type: Lightning.shaders.RoundedRectangle, radius: 12 },
          Text: {
            w: 250,
            text: {
              color: Colors(colors.white).get(),
              fontFace: 'Montserrat-Bold',
              textAlign: 'center',
            },
          },
        },
      },
    };
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
    const { callback } = this._props;
    callback();
  }

  _focus() {
    // this.patch({
    //   color: Colors(colors.focus).get(),
    // });

    this._FocusBorder.patch({
      texture: lng.Tools.getRoundRect(260, 75, 12, 4, Colors(colors.focus).get(), false),
      Column: {
        color: Colors(colors.focus).get(),
      },
    });
  }

  _unfocus() {
    // this.patch({
    //   color: Colors(colors.unfocusedLanguage).alpha(0).get(),
    // });

    this._FocusBorder.patch({
      texture: lng.Tools.getRoundRect(
        260,
        75,
        12,
        4,
        Colors(colors.background).alpha(0).get(),
        false
      ),
      Column: {
        color: Colors(colors.unfocusedLanguage).alpha(0).get(),
      },
    });
  }

  _handleHover() {
    this._focus();
    this.fireAncestors('$handleItemHover', this.parent.children.indexOf(this));
  }

  _handleClick() {
    const { callback } = this._props;
    callback();
  }
}

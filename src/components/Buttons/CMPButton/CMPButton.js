import { Colors, Lightning } from '@lightningjs/sdk';
import colors from '../../../../reskin/colors.json';

export default class CMPButton extends Lightning.Component {
  _props = {
    label: '',
    callback: () => {},
  };

  static _template() {
    return {
      collision: true,
      flex: { direction: 'row', alignItems: 'center' },
      flexItem: {
        marginBottom: 20,
      },
      h: 65,
      rect: true,
      shader: { type: Lightning.shaders.RoundedRectangle, radius: 12 },
      Text: {
        text: {
          paddingLeft: 20,
        },
      },
    };
  }

  get _Text() {
    return this.tag('Text');
  }

  set props(props) {
    const { items, ...rest } = props;
    this._props = { ...this._props, ...rest };
  }

  _active() {
    setTimeout(
      () =>
        this.stage.once('frameStart', () => {
          this.patch({
            w: this._Text.finalW + 20,
          });
        }),
      200
    );
  }

  _enable() {
    const { label, width } = this._props;
    this.patch({
      color: Colors(colors.unfocusedLanguage).alpha(0).get(),
      Text: {
        text: label,
        color: Colors(colors.white).get(),
        fontFace: 'Montserrat-Bold',
      },
    });
  }

  async _handleEnter() {
    const { callback } = this._props;
    callback();
  }

  _focus() {
    this.patch({
      color: Colors(colors.focus).get(),
    });
  }

  _unfocus() {
    this.patch({
      color: Colors(colors.unfocusedLanguage).alpha(0).get(),
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

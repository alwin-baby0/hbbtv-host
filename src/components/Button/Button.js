import { Colors, Lightning } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';

export default class Button extends Lightning.Component {
  _props = {
    width: 285,
    height: 78,
    buttonLabel: '',
    buttonIcon: '',
    iconWidth: 25,
    iconHeight: 25,
    radius: 0,
    strokeWidth: 4,
    callback: () => null,
  };

  static _template() {
    return {
      Button: {
        flex: { direction: 'row', alignItems: 'center' },
        Icon: {
          x: 50,
        },
        Label: {
          x: 60,
          h: 25,
          color: Colors(colors.unfocus).get(),
          text: {
            fontFamily: 'Inter',
            fontStyle: 'normal bold',
            fontSize: 20,
            lineHeight: 25,
            letterSpacing: 2,
          },
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };

    const { width, height, buttonLabel, buttonIcon, iconWidth, iconHeight, radius, strokeWidth } =
      this._props;

    this._Button.patch({
      texture: Lightning.Tools.getRoundRect(
        width,
        height,
        radius,
        strokeWidth,
        Colors(colors.unfocus).get(),
        false
      ),
    });

    this._Icon.patch({
      texture: lng.Tools.getSvgTexture(buttonIcon, iconWidth, iconHeight),
    });

    this._Label.patch({
      text: {
        text: buttonLabel,
      },
    });
  }

  get _Button() {
    return this.tag('Button');
  }

  get _Icon() {
    return this.tag('Icon');
  }

  get _Label() {
    return this.tag('Label');
  }

  _focus() {
    const { width, height, radius, strokeWidth } = this._props;
    this._Button.patch({
      texture: Lightning.Tools.getRoundRect(
        width,
        height,
        radius,
        strokeWidth,
        Colors(colors.focus).get(),
        true,
        Colors(colors.focus).get()
      ),
    });
  }

  _unfocus() {
    const { width, height, radius, strokeWidth } = this._props;
    this._Button.patch({
      texture: Lightning.Tools.getRoundRect(
        width,
        height,
        radius,
        strokeWidth,
        Colors(colors.unfocus).get(),
        false
      ),
    });
  }

  _handleEnter() {
    const { callback } = this._props;
    callback();
  }
}

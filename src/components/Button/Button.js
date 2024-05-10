import { Colors, Lightning } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';

export default class Button extends Lightning.Component {
  _width = 0;
  _height = 0;
  _buttonLabel = '';
  _buttonIcon = '';
  _iconWidth = 0;
  _iconHeight = 0;
  _radius = 0;
  _strokeWidth = 0;

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
    const { width, height, buttonLabel, buttonIcon, iconWidth, iconHeight, radius, strokeWidth } =
      props;

    this._width = width;
    this._height = height;
    this._buttonLabel = buttonLabel;
    this._buttonIcon = buttonIcon;
    this._iconWidth = iconWidth;
    this._iconHeight = iconHeight;
    this._radius = radius;
    this._strokeWidth = strokeWidth;

    this._Button.patch({
      texture: Lightning.Tools.getRoundRect(
        this._width,
        this._height,
        this._radius,
        this._strokeWidth,
        Colors(colors.focus).get(),
        true,
        Colors(colors.focus).get()
      ),
    });

    this._Icon.patch({
      texture: lng.Tools.getSvgTexture(this._buttonIcon, this._iconWidth, this._iconHeight),
    });

    this._Label.patch({
      text: {
        text: this._buttonLabel,
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
    this._Button.patch({
      texture: Lightning.Tools.getRoundRect(
        this._width,
        this._height,
        this._radius,
        this._strokeWidth,
        Colors(colors.focus).get(),
        true,
        Colors(colors.focus).get()
      ),
    });
  }

  _unfocus() {
    this._Button.patch({
      texture: Lightning.Tools.getRoundRect(
        this._width,
        this._height,
        this._radius,
        this._strokeWidth,
        Colors(colors.unfocus).get(),
        false
      ),
    });
  }
}

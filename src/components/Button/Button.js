import { Colors, Lightning } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';

export default class Button extends Lightning.Component {
  _isFocused = false;
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
      flex: { direction: 'row', alignItems: 'center' },
      Icon: {
        x: 50,
      },
      Label: {
        x: 60,
        h: 25,
        color: Colors(this._isFocused ? colors.focus : colors.unfocus).get(),
        Text: {
          h: 25,
          text: {
            fontFace: 'Montserrat-Bold',
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

    const {
      width,
      height,
      buttonLabel,
      buttonIcon,
      iconWidth,
      iconHeight,
      radius,
      strokeWidth,
      borderColor,
    } = this._props;
    const colorBorder = borderColor ? borderColor : colors.unfocus;

    if (buttonIcon === '') {
      this._Label.patch({
        w: width,
        flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
        x: 0,
      });
    }

    this.patch({
      w: width,
      h: height,
      texture: Lightning.Tools.getRoundRect(
        width,
        height,
        radius,
        strokeWidth,
        Colors(this._isFocused ? colors.focus : colorBorder).get(),
        this._isFocused,
        this._isFocused ? Colors(colors.focus).get() : undefined
      ),
    });

    this._Icon.patch({
      texture: lng.Tools.getSvgTexture(buttonIcon, iconWidth, iconHeight),
    });

    this._Label.tag('Text').patch({
      text: {
        text: buttonLabel,
      },
    });
  }

  get _Icon() {
    return this.tag('Icon');
  }

  get _Label() {
    return this.tag('Label');
  }

  _focus() {
    const { width, height, radius, strokeWidth } = this._props;
    this._isFocused = true;
    this.patch({
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
    const { width, height, radius, strokeWidth, borderColor } = this._props;
    const colorBorder = borderColor ? borderColor : colors.unfocus;
    this._isFocused = false;
    this.patch({
      texture: Lightning.Tools.getRoundRect(
        width,
        height,
        radius,
        strokeWidth,
        Colors(colorBorder).get(),
        false
      ),
    });
  }

  _handleEnter() {
    const { callback } = this._props;
    callback();
  }
}

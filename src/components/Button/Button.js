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
    enabled: true,
  };

  static _template() {
    return {
      flex: { direction: 'row', alignItems: 'center' },
      Icon: {
        x: 20,
      },
      Label: {
        x: 30,
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
      enabled,
    } = this._props;

    const colorBorder = borderColor ? borderColor : colors.unfocus;

    if (buttonIcon === '') {
      this._Label.patch({
        w: width,
        flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
        x: 0,
      });
    }

    let focusingColors;
    let fillColor;

    if (enabled) {
      focusingColors = Colors(this._isFocused ? colors.focus : colorBorder).get();
      fillColor = Colors(colors.focus).get();
    }

    if (!enabled) {
      focusingColors = Colors(
        this._isFocused ? colors.focusDisabled : colors.unfocusDisabled
      ).get();
      fillColor = Colors(colors.focusDisabled).get();
    }

    this.patch({
      w: width,
      h: height,
      texture: Lightning.Tools.getRoundRect(
        width,
        height,
        radius,
        strokeWidth,
        focusingColors,
        this._isFocused,
        this._isFocused ? fillColor : undefined
      ),
      Icon: {
        texture: lng.Tools.getSvgTexture(buttonIcon, iconWidth, iconHeight),
      },
      Label: {
        Text: {
          text: {
            text: buttonLabel,
          },
        },
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
        Colors(this._props.enabled ? colors.focus : colors.focusDisabled).get(),
        true,
        Colors(this._props.enabled ? colors.focus : colors.focusDisabled).get()
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
        Colors(this._props.enabled ? colorBorder : colors.unfocusDisabled).get(),
        false
      ),
    });
  }

  _disable() {
    this._props.enabled = true;
  }

  _handleEnter() {
    const { callback } = this._props;
    callback();
  }

  _handleHover() {
    this._focus();
    this.fireAncestors('$updateVerticalState', 'HeroSection');
    this.fireAncestors('$setButtonState', this.ref); //sending ref name
  }

  _handleUnhover() {
    this._unfocus();
  }

  _handleClick() {
    const { callback } = this._props;
    callback();
  }
}

import { Colors, Lightning } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import FocusableItem from '../FocusableItem/FocusableItem';

export default class Button extends FocusableItem {
  _isFocused = false;
  _props = {
    width: 285,
    height: 78,
    buttonLabel: '',
    buttonIcon: '',
    iconWidth: 25,
    iconHeight: 25,
    radius: 10,
    strokeWidth: 4,
    callback: () => null,
    enabled: true,
  };

  static _template() {
    return {
      ...super._template(),
      maxHeight: 88,
      Icon: {
        x: 20,
        y: (h) => h / 2 - 12,
      },
      Label: {
        x: 50,
        y: (h) => h / 2 - 12,
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
      Progress: {
        clipping: true,
      },
    };
  }

  progressW;

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
      position,
      duration,
    } = this._props;

    this.setProps({
      x: -7,
      y: -7,
      width: width + 10,
      height: height + 10,
      radius: 8,
      strokeWidth: 2,
      strokeColor: Colors(colors.focus).get(),
    });

    const progressPercent = Math.round((position / duration) * 100);
    this.progressW = Math.min((width * progressPercent) / 100, width);

    const colorBorder = borderColor ? borderColor : colors.unfocus;

    if (buttonIcon === '') {
      this._Label.patch({
        w: width,
        flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
        x: 0,
      });
    }

    if (buttonLabel === '') {
      this._Icon.patch({
        x: 38,
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
        true,
        this._isFocused ? fillColor : undefined
      ),
      Icon: {
        texture: lng.Tools.getSvgTexture(buttonIcon, iconWidth, iconHeight),
        color: this._isFocused ? Colors(colors.white).get() : Colors(colors.black).get(),
      },
      Label: {
        Text: {
          text: {
            text: buttonLabel,
            textColor: this._isFocused ? Colors(colors.white).get() : Colors(colors.black).get(),
          },
        },
      },
    });

    if (position && this.progressW) {
      this.patch({
        Progress: {
          w: this.progressW,
          h: 10,
          y: 68,
          clipping: true,
          texture: Lightning.Tools.getRoundRect(this.progressW, 10, 6, null, null, true, fillColor),
        },
      });
    }
  }

  get _Icon() {
    return this.tag('Icon');
  }

  get _Label() {
    return this.tag('Label');
  }

  _focus() {
    const { width, height, radius, strokeWidth, position } = this._props;
    super._focus();
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
      Icon: {
        color: Colors(colors.white).get(),
      },
      Label: {
        Text: {
          text: {
            textColor: Colors(colors.white).get(),
          },
        },
      },
      Progress: {
        texture: position
          ? Lightning.Tools.getRoundRect(
              this.progressW,
              10,
              6,
              null,
              null,
              true,
              Colors(colors.white).get()
            )
          : null,
      },
    });
  }

  _unfocus() {
    const { width, height, radius, strokeWidth, borderColor, position } = this._props;
    super._unfocus();
    const colorBorder = borderColor ? borderColor : colors.white;
    this._isFocused = false;
    this.patch({
      texture: Lightning.Tools.getRoundRect(
        width,
        height,
        radius,
        strokeWidth,
        Colors(this._props.enabled ? colorBorder : colors.unfocusDisabled).get(),
        true,
        Colors(colors.white).get()
      ),
      Icon: {
        color: Colors(colors.black).get(),
      },
      Label: {
        Text: {
          text: {
            textColor: Colors(colors.black).get(),
          },
        },
      },
      Progress: {
        texture: position
          ? Lightning.Tools.getRoundRect(
              this.progressW,
              10,
              6,
              null,
              null,
              true,
              Colors(colors.focus).get()
            )
          : null,
      },
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
    this.fireAncestors('$handleItemHover', this.parent.children.indexOf(this));
    this.fireAncestors('$setButtonState', this.ref); //sending ref name
  }

  _handleClick() {
    const { callback } = this._props;
    callback();
  }
}

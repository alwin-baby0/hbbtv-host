import { Colors, Lightning } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';

export default class Button extends Lightning.Component {
  _isFocused = false;
  _autoWidthPadding = 50
  entered = 0;
  _props = {
    width: 465,
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
      maxHeight: 88,
      Border: {},
      Icon: {
        x: 60,
        y: (h) => h / 2 - 12,
      },
      Label: {
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

  _onTextTextureLoaded = () => {
    const labelTextRenderWidth = this._Label.tag('Text')?.texture?.getRenderWidth()
    if (this.w === labelTextRenderWidth + this._autoWidthPadding * 2) return
    const {
      height,
      buttonLabel,
      radius,
      strokeWidth,
      borderColor,
      enabled,
      autoWidth,
      textProps,
    } = this._props;

    let focusingColors;
    let fillColor;
    const colorBorder = borderColor ? borderColor : colors.unfocus;

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
      w: labelTextRenderWidth + this._autoWidthPadding * 2,
      h: height,
      texture: Lightning.Tools.getRoundRect(
        labelTextRenderWidth + this._autoWidthPadding * 2,
        height,
        radius,
        strokeWidth,
        true,
        this._isFocused ? fillColor : undefined
      ),
      Icon: {
        visible: false,
      },
      Label: {
        x: this._autoWidthPadding,
        Text: {
          y: -2,
          text: {
            textColor: this._isFocused ? Colors(colors.white).get() : Colors(colors.black).get(), ...textProps
          },
        },
      },
    });

  }

  set props(props) {
    this._props = { ...this._props, ...props };
    if (this._props?.autoWidth) {
      this.w = 0
    }

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
      autoWidth,
      textProps,
    } = this._props;

    if (position && duration) {
      const progressPercent = Math.round((position / duration) * 100);
      this.progressW = Math.min((width * progressPercent) / 100, width);
    } else {
      this.progressW = 0;
    }

    const colorBorder = borderColor ? borderColor : colors.unfocus;

    this._Label.patch({
      flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
      x: 0,
    });

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

    if (autoWidth) {
      this._Label.patch({ Text: undefined })
      this.patch({
        Label: {
          flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
          Text: {
            text: {
              text: buttonLabel,
              fontFace: 'Montserrat-Bold',
              fontSize: 20,
              lineHeight: 25,
              letterSpacing: 2,
              textColor: Colors(this._props.enabled ? colors.focus : colors.focusDisabled).get(),
              ...textProps
            },
          },
        },
      });
      this._Label.tag('Text').on('txLoaded', this._onTextTextureLoaded);
    } else {
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
          visible: this._props.enabled,
        },
        Label: {
          flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
          x: (w) => w / 2 + iconWidth,
          mountX: 0.5,
          Text: {
            text: {
              text: buttonLabel,
              textColor: this._isFocused ? Colors(colors.white).get() : Colors(colors.black).get(),
            },
          },
        },
      });
    }

    if (position && duration && this.progressW) {
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
    const { width, height, radius, autoWidth } = this._props;
    this._isFocused = true;
    if (autoWidth) {
      const labelTextRenderWidth = this._Label.tag('Text').texture.getRenderWidth()
      this.patch({
        texture: Lightning.Tools.getRoundRect(
          labelTextRenderWidth + this._autoWidthPadding * 2,
          height,
          radius,
          0,
          0,
          true,
          Colors(this._props.enabled ? colors.focus : colors.focusDisabled).get()
        ),
        Border: {
          w: labelTextRenderWidth + this._autoWidthPadding * 2 + 14,
          h: height + 14,
          x: -7,
          y: -7,
          texture: Lightning.Tools.getRoundRect(
            labelTextRenderWidth + this._autoWidthPadding * 2 + 14,
            height + 14,
            radius,
            2,
            Colors(colors.focus).get(),
            false,
            0
          ),
        },
        Label: {
          Text: {
            text: {
              textColor: Colors(colors.white).get(),
            },
          },
        },
      });

    } else {
      this.patch({
        texture: Lightning.Tools.getRoundRect(
          width,
          height,
          radius,
          0,
          0,
          true,
          Colors(this._props.enabled ? colors.focus : colors.focusDisabled).get()
        ),
        Border: {
          w: width + 14,
          h: height + 14,
          x: -7,
          y: -7,
          texture: Lightning.Tools.getRoundRect(
            width + 14,
            height + 14,
            radius,
            2,
            Colors(colors.focus).get(),
            false,
            0
          ),
        },
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
          texture: this.progressW
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
  }

  _unfocus() {
    const { width, height, radius, autoWidth } = this._props;
    this._isFocused = false;
    if (autoWidth) {
      const labelTextRenderWidth = this._Label.tag('Text').texture.getRenderWidth()
      this.patch({
        texture: Lightning.Tools.getRoundRect(
          labelTextRenderWidth + this._autoWidthPadding * 2,
          height,
          radius,
          0,
          0,
          true,
          Colors(colors.white).get()
        ),
        Border: {
          texture: null,
        },
        Label: {
          Text: {
            text: {
              textColor: Colors(colors.black).get(),
            },
          },
        },
      });

    } else {
      this.patch({
        texture: Lightning.Tools.getRoundRect(
          width,
          height,
          radius,
          0,
          0,
          true,
          Colors(colors.white).get()
        ),
        Border: {
          texture: null,
        },
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
          texture: this.progressW
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
  }

  _disable() {
    this._props.enabled = true;
  }

  _handleEnter() {
    if (!this._props.enabled) {
      return true;
    }

    this.entered = (this.entered + 1) % 2;
    if (didomiVisible && this.entered === 1) {
      return true;
    }

    if (didomiVisible && this.entered === 0) {
      this.fireAncestors('$didomiVisible', false);
      return;
    }

    const { callback } = this._props;
    callback();
  }

  _handleHover() {
    this._focus();
    this.fireAncestors('$handleItemHover', this.parent.children.indexOf(this));
    this.fireAncestors('$setButtonState', this.ref); //sending ref name
  }

  _handleClick() {
    if (!this._props.enabled) {
      return true;
    }
    const { callback } = this._props;
    callback();
  }
}

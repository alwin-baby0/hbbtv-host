import { Colors, Lightning, Router } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';

export default class CategoryPickerItem extends Lightning.Component {
  _props = {
    itemInfo: null,
    callback: () => null,
  };

  static _template() {
    return {
      FocusBorder: {
        zIndex: 1,
        Button: {
          rect: true,
        },
        Title: {
          mountX: 0.5,
          mountY: 0.5,
          x: (w) => w / 2,
          y: (h) => h / 2,
          text: {
            fontFace: 'Montserrat-Bold',
            fontSize: 20,
            textAlign: 'center',
            textColor: Colors(colors.white).get(),
            textOverflow: 'ellipsis',
            wordWrapWidth: 180,
            wordWrap: false,
          },
        },
      },
    };
  }

  get _Title() {
    return this.tag('Title');
  }

  get _FocusBorder() {
    return this.tag('FocusBorder');
  }

  get _ButtonItem() {
    return this.tag('ButtonItem');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { itemInfo, w, h, strokeWidth, radius } = this._props;
    const { title } = itemInfo;

    this.w = w + 10;
    this.h = h + 10;

    this._FocusBorder.patch({
      w: this.w,
      h: this.h,
      Button: {
        x: 5,
        y: 5,
        w,
        h,
        texture: Lightning.Tools.getRoundRect(
          w,
          h,
          radius,
          strokeWidth,
          Colors(colors.white).get(),
          true,
          Colors(colors.catPickerItemUnf).get()
        ),
      },
      Title: {
        x: this.w / 2,
        y: this.h / 2,
        text: { text: title.toUpperCase() },
      },
    });
  }

  _handleHover() {
    Router.focusPage();
    const { index } = this._props;

    this.fireAncestors('$handleItemHover', index);
    this._focus();
  }

  _handleClick() {
    const { callback } = this._props;
    try {
      this.fireAncestors('$updateChannels', this._props);
      callback();
    } catch (error) {
      console.error('Error fetching category type:', error);
    }
  }

  _focus() {
    const { w, h, radius, strokeWidth } = this._props;

    this.patch({
      Title: undefined,
    });
    this._FocusBorder.patch({
      texture: Lightning.Tools.getRoundRect(
        w + 10,
        h + 10,
        8,
        2,
        Colors(colors.focus).get(),
        false
      ),
      Button: {
        x: 5,
        y: 5,
        w,
        h,
        texture: Lightning.Tools.getRoundRect(
          w,
          h,
          radius,
          strokeWidth,
          Colors(colors.focus).get(),
          true,
          Colors(colors.focus).get()
        ),
      },
    });
  }

  _unfocus() {
    const { w, h, radius, strokeWidth } = this._props;

    this._FocusBorder.patch({
      texture: Lightning.Tools.getRoundRect(
        w + 10,
        h + 10,
        8,
        2,
        Colors(colors.background).get(),
        false
      ),
      Button: {
        x: 5,
        y: 5,
        w,
        h,
        texture: Lightning.Tools.getRoundRect(
          w,
          h,
          radius,
          strokeWidth,
          Colors(colors.white).get(),
          true,
          Colors(colors.catPickerItemUnf).get()
        ),
      },
    });
  }

  async _handleEnter() {
    const { callback } = this._props;
    try {
      this.fireAncestors('$updateChannels', this._props);
      callback();
    } catch (error) {
      console.error('Error fetching category type:', error);
    }
  }
}

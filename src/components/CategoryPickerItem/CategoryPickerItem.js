import { Colors, Lightning, Router } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import FocusableItem from '../FocusableItem/FocusableItem';

export default class CategoryPickerItem extends FocusableItem {
  _props = {
    itemInfo: null,
    callback: () => null,
  };

  static _template() {
    return {
      ...super._template(),
      Button: {
        rect: true,
      },
      Title: {
        mountX: 0.5,
        mountY: 0.5,
        x: (w) => w / 2,
        y: (h) => h / 2 + 2,
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
    };
  }

  get _Title() {
    return this.tag('Title');
  }

  get _ButtonItem() {
    return this.tag('ButtonItem');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { itemInfo, w, h, strokeWidth, radius } = this._props;
    const { title } = itemInfo;
    this.setProps({
      x: -2,
      y: -1,
      width: w + 10,
      height: h + 10,
      radius: 12,
      strokeWidth: 2,
      strokeColor: Colors(colors.focus).get(),
    });

    this.patch({
      w: w + 10,
      h: h + 10,
      Button: {
        x: 5,
        y: 6,
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

    super._focus();
    this.patch({
      Button: {
        x: 5,
        y: 6,
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

    super._unfocus();
    this.patch({
      Button: {
        x: 5,
        y: 6,
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

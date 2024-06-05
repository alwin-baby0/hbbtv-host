import { Colors, Lightning, Router } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';

export default class CategoryPickerItem extends Lightning.Component {
  _props = {
    itemInfo: null,
    navigateTo: '',
  };

  static _template() {
    return {
      h: 64,
      flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
      Title: {
        h: 24,
        text: {
          fontSize: 20,
          lineHeight: 25,
        },
      },
    };
  }

  get _Title() {
    return this.tag('Title');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { itemInfo, w, h } = this._props;
    const { title } = itemInfo;

    this.patch({
      w,
      h,
      flexItem: {
        shrink: false,
      },
    });
    this._Title.patch({
      text: {
        text: title.toUpperCase(),
        textColor: Colors(colors.focus).get(),
      },
    });
  }

  _focus() {
    const { w, h, radius, strokeWidth } = this._props;
    this.patch({
      texture: Lightning.Tools.getRoundRect(
        w,
        h,
        radius,
        strokeWidth,
        Colors(colors.focus).get(),
        true,
        Colors(colors.focus).get()
      ),
    });
    this._Title.patch({
      text: {
        textColor: Colors(colors.unfocus).get(),
      },
    });
  }

  _unfocus() {
    const { w, h } = this._props;
    this.patch({
      texture: Lightning.Tools.getRoundRect(w, h),
    });
    this._Title.patch({
      text: {
        textColor: Colors(colors.focus).get(),
      },
    });
  }

  _handleEnter() {
    const { navigateTo } = this._props;
    Router.navigate(navigateTo);
  }
}

import { Colors, Lightning } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';

export default class CategoryPickerItem extends Lightning.Component {
  _props = {
    itemInfo: null,
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
    const { itemInfo } = this._props;
    const { title } = itemInfo;

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
    // const { itemInfo } = this._props;
    // Router.navigate(`filteredPage?filter=${itemInfo.title}&type=${itemInfo.type.value}`);
  }
}

import { Colors, Lightning, Router } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';

export default class CategoryPickerItem extends Lightning.Component {
  _props = {
    itemInfo: null,
    callback: () => null,
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
          fontFace: 'Montserrat-Medium',
          // wordWrapWidth: 150,
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
      h: 24,
      // w: 180,
      text: {
        textAlign: title.length < 15 ? 'center' : 'left',
        maxLines: title.length > 15 ? 2 : 1,
        wordWrapWidth: 180,
        text: title.toUpperCase(),
        fontSize: 20,
        lineHeight: 25,
        textColor: Colors(colors.focus).get(),
        textOverflow: 'ellipsis',
        wordWrap: false,
      },
    });
  }

  _handleHover() {
    Router.focusPage();
    const { index } = this._props;
    console.log('ho ve ro va no', index);
    console.log('cat picker this', this);
    const parentName = this.parent.parent.parent.parent.parent.parent.ref;
    console.log(parentName);
    this.fireAncestors('$horizontalPosterIndexChange', index);
    this._focus();
    if (parentName === 'VodContentContainer') {
      this.fireAncestors('$updateVerticalState', 'VodContentContainer');
    } else {
      this.fireAncestors('$updateVerticalState', 'Categories');
    }
  }

  _handleUnhover() {
    this._unfocus();
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
    const { w, h, radius, strokeWidth, itemInfo } = this._props;
    const { title } = itemInfo;

    this.patch({
      Title: undefined,
    });
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
      Title: {
        h: 24,
        w: 180,
        text: {
          textAlign: title.length < 15 ? 'center' : 'left',
          maxLines: title.length > 15 ? 2 : 1,
          wordWrapWidth: 180,
          text: title.toUpperCase(),
          fontSize: 20,
          lineHeight: 25,
          textColor: Colors(colors.unfocus).get(),
          textOverflow: 'ellipsis',
          wordWrap: false,
        },
      },
    });
  }

  _unfocus() {
    const { w, h, itemInfo } = this._props;
    const { title } = itemInfo;

    this.patch({
      Title: undefined,
    });
    this.patch({
      texture: Lightning.Tools.getRoundRect(w, h),
      Title: {
        h: 24,
        w: 180,
        text: {
          textAlign: title.length < 15 ? 'center' : 'left',
          maxLines: title.length > 15 ? 2 : 1,
          //wordWrapWidth: 130,
          text: title.toUpperCase(),
          fontSize: 20,
          lineHeight: 25,
          textColor: Colors(colors.focus).get(),
          textOverflow: 'ellipsis',
          wordWrap: false,
        },
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

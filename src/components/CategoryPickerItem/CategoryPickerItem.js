import { Colors, Lightning, Router } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import FocusableItem from '../FocusableItem/FocusableItem';
import { Metrics } from '@firebolt-js/sdk';
import { getDeviceType } from '../../utils/device';
import { didomiVisible } from '../../App';

export default class CategoryPickerItem extends FocusableItem {
  _props = {
    itemInfo: null,
    callback: () => null,
  };
  _paddingForEachSide = 15
  _focused = false

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
          wordWrap: false,
        },
      },
    };
  }

  _getMinimumWidth(width) {
    const total = width + 2 * this._paddingForEachSide;
    return Math.max(total, this._props?.w);
  }


  _onTitleTextureLoaded = () => {
    const labelTextRenderWidth = this.tag('Title')?.texture?.getRenderWidth()
    const minWidth = this._getMinimumWidth(labelTextRenderWidth)
    if (this.w === minWidth + 10) return

    const { itemInfo, w, h, strokeWidth, radius } = this._props;
    const { title, data } = itemInfo;

    this.setProps({
      x: -2,
      y: -1,
      width: minWidth + 10,
      height: h + 10,
      radius: 12,
      strokeWidth: 2,
      strokeColor: Colors(colors.focus).get(),
    });

    this.patch({
      w: minWidth + 10,
      h: h + 10,
      Button: {
        x: 5,
        y: 6,
        minWidth,
        h,
        texture: Lightning.Tools.getRoundRect(
          minWidth,
          h,
          radius,
          strokeWidth,
          Colors(this._focused ? colors.focus : colors.white).get(),
          true,
          Colors(this._focused ? colors.focus : colors.catPickerItemUnf).get()
        ),
      },
    });

  }

  set props(props) {
    this._props = { ...this._props, ...props };
    this.w = 0

    const { itemInfo, w, h, strokeWidth, radius } = this._props;
    const { title, data } = itemInfo;

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
      Title: {
        text: {
          text: title
            ? title.toUpperCase()
            : data.localised
              ? data.localised.toUpperCase()
              : data.value?.toUpperCase(),
        },
      },
    });
    this.tag('Title').on('txLoaded', this._onTitleTextureLoaded);
  }

  _handleHover() {
    if (!Router.isNavigating()) {
      Router.focusPage();
    }
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
      const deviceType = getDeviceType();
      deviceType === 'metrological' &&
        Metrics.error(Metrics.ErrorType.MEDIA, '400', 'Error fetching category type', true);
      console.error('Error fetching category type:', error);
    }
  }

  _focus() {
    this._focused = true
    const labelTextRenderWidth = this.tag('Title')?.texture?.getRenderWidth()
    const { w, h, radius, strokeWidth } = this._props;
    const minWidth = this._getMinimumWidth(labelTextRenderWidth)

    super._focus();
    this.patch({
      Button: {
        x: 5,
        y: 6,
        w: minWidth,
        h,
        texture: Lightning.Tools.getRoundRect(
          minWidth,
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
    this._focused = false
    const labelTextRenderWidth = this.tag('Title')?.texture?.getRenderWidth()
    const { w, h, radius, strokeWidth } = this._props;
    const minWidth = this._getMinimumWidth(labelTextRenderWidth)

    super._unfocus();
    this.patch({
      Button: {
        x: 5,
        y: 6,
        w: minWidth,
        h,
        texture: Lightning.Tools.getRoundRect(
          minWidth,
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
    if (window.Didomi && didomiVisible) {
      return true;
    }

    const { callback } = this._props;
    try {
      this.fireAncestors('$updateChannels', this._props);
      callback();
    } catch (error) {
      const deviceType = getDeviceType();
      deviceType === 'metrological' &&
        Metrics.error(Metrics.ErrorType.MEDIA, '400', 'Error fetching category type', true);
      console.error('Error fetching category type:', error);
    }
  }
}

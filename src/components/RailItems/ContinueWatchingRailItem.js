import { Colors, Router, Utils, Lightning } from '@lightningjs/sdk';
import { CARD_SIZES, IMG_PATH } from '../../constants/globalConstants';

import colors from '../../../reskin/colors.json';
import FocusableItem from '../FocusableItem/FocusableItem';
import Image from '../Image/Image';
import ProgressBar from '../../pages/Player/components/ProgressBar/ProgressBar';

export default class ContinueWatchingRailItem extends FocusableItem {
  _props = {
    imageSrc: '',
    placeholderSrc: Utils.asset(IMG_PATH.LANDSCAPE_RAIL_PH),
    radius: 6,
    strokeWidth: 4,
    x: -2,
    y: -2,
    strokeColor: Colors(colors.focus).get(),
    callback: () => null,
    index: 0,
  };

  static _template() {
    return {
      ...super._template(),
      color: Colors(colors.landscapeBackground).get(),
      rect: true,
      zIndex: 3,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 6,
      },
      w: CARD_SIZES.CONTINUE_WATCHING.width,
      h: CARD_SIZES.CONTINUE_WATCHING.height,
      Wrapper: {
        flex: { direction: 'column' },
        Border: {
          flex: { justifyContent: 'center', alignItems: 'center' },
          LandscapeImage: {
            type: Image,
          },
        },
        ProgressBar: {
          y: -20,
          type: ProgressBar,
          props: {
            width: CARD_SIZES.CONTINUE_WATCHING.width - 40,
            flexItem: {
              marginLeft: 20,
              marginRight: 20,
            },
            progressColor: Colors(colors.focus).get(),
            backgroundBarColor: colors.unfocus,
          },
        },
      },
    };
  }

  get _LandscapeImage() {
    return this.tag('LandscapeImage');
  }

  get _ProgressBar() {
    return this.tag('ProgressBar');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { imageSrc, radius, placeholderSrc } = this._props;

    this.setProps({
      width: 385,
      height: 215,
    });

    this._LandscapeImage.patch({
      props: {
        width: CARD_SIZES.CONTINUE_WATCHING.image_width,
        height: CARD_SIZES.CONTINUE_WATCHING.image_height,
        imageSrc: imageSrc,
        placeholderSrc: placeholderSrc,
        radius: radius,
      },
    });
  }

  _focus() {
    super._focus();
  }

  _unfocus() {
    super._unfocus();
  }

  _handleEnter() {
    const { callback } = this._props;
    callback();
  }

  _handleClick() {
    const { callback } = this._props;
    callback();
  }

  _handleHover() {
    Router.focusPage();
    const { index } = this._props;
    this.fireAncestors('$handleItemHover', index);
    this._focus();
  }
}

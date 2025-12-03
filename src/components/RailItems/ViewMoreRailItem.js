import { Router, Utils, Colors } from '@lightningjs/sdk';

import FocusableItem from '../FocusableItem/FocusableItem';
import { CARD_SIZES, IMG_PATH } from '../../constants/globalConstants';
import Image from '../Image/Image';
import colors from '../../../reskin/colors.json';

export default class ViewMoreRailItem extends FocusableItem {
  _props = {
    radius: 6,
    strokeWidth: 4,
    x: -2,
    y: -2,
    strokeColor: Colors(colors.focus).get(),
    callback: () => null,
  };

  static _template() {
    return {
      ...super._template(),
      Wrapper: {
        flex: { direction: 'column' },
        Border: {
          flex: { justifyContent: 'center', alignItems: 'center' },
          PosterImage: {
            type: Image,
          },
        },
        Title: {
          y: 15,
          h: 45,
          w: 273,
          text: {
            text: 'View More',
            fontFace: 'Montserrat-Regular',
            fontSize: 18,
            lineHeight: 22,
          },
        },
      },
    };
  }

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  get _PosterImage() {
    return this.tag('PosterImage');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { radius, orientation, cardType } = this._props;

    this.setProps({
      width: orientation
        ? orientation === 'landscape'
          ? CARD_SIZES[cardType].landscape_image_width
          : CARD_SIZES[cardType].poster_image_width
        : CARD_SIZES[cardType].image_width,
      height: orientation
        ? orientation === 'landscape'
          ? CARD_SIZES[cardType].landscape_image_height
          : CARD_SIZES[cardType].poster_image_height
        : CARD_SIZES[cardType].image_height,
    });

    this.patch({
      w: orientation
        ? orientation === 'landscape'
          ? CARD_SIZES[cardType].landscape_width
          : CARD_SIZES[cardType].poster_width
        : CARD_SIZES[cardType].width,
      h: orientation
        ? orientation === 'landscape'
          ? CARD_SIZES[cardType].landscape_container_height
          : CARD_SIZES[cardType].poster_container_height
        : CARD_SIZES[cardType].container_height,
      Wrapper: {
        Border: {
          PosterImage: {
            props: {
              width: orientation
                ? orientation === 'landscape'
                  ? CARD_SIZES[cardType].landscape_image_width
                  : CARD_SIZES[cardType].poster_image_width
                : CARD_SIZES[cardType].image_width,
              height: orientation
                ? orientation === 'landscape'
                  ? CARD_SIZES[cardType].landscape_image_height
                  : CARD_SIZES[cardType].poster_image_height
                : CARD_SIZES[cardType].image_height,
              imageSrc: Utils.asset(IMG_PATH.EMPTY_RAIL_PH),
              placeholderSrc: Utils.asset(IMG_PATH.EMPTY_RAIL_PH),
              radius: radius,
            },
          },
        },
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
    if (!Router.isNavigating()) {
      Router.focusPage();
    }
    const { index } = this._props;
    this.fireAncestors('$handleItemHover', index);
    this._focus();
  }
}

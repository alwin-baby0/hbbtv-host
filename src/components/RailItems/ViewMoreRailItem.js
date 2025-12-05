import { Router, Utils, Colors } from '@lightningjs/sdk';

import FocusableItem from '../FocusableItem/FocusableItem';
import { CARD_SIZES, IMG_PATH, TRANSLATIONS } from '../../constants/globalConstants';
import Image from '../Image/Image';
import colors from '../../../reskin/colors.json';
import { t } from '../../Services';

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
            flex: { justifyContent: 'center', alignItems: 'center' },
            Logo: {
              y: -20,
              h: 80,
              w: 80,
              src: Utils.asset(IMG_PATH.SHOW_MORE_ICON),
              Title: {
                y: 85,
                h: 45,
                w: 273,
                x: -10,
                text: {
                  fontFace: 'Montserrat-Regular',
                  fontSize: 24,
                  lineHeight: 22,
                },
              },
            },
            type: Image,
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
            Logo: {
              Title: {
                text: {
                  text: t(TRANSLATIONS.VIEW_MORE),
                },
              },
            },
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
              imageSrc: Utils.asset(
                orientation === 'landscape'
                  ? IMG_PATH.SHOW_MORE_LANDSCAPE
                  : IMG_PATH.SHOW_MORE_PORTRAIT
              ),
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

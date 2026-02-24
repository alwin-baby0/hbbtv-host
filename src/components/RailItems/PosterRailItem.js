import { CARD_SIZES, IMG_PATH } from '../../constants/globalConstants';

import { Utils, Router, Colors } from '@lightningjs/sdk';
import FocusableItem from '../FocusableItem/FocusableItem';
import Image from '../Image/Image';
import colors from '../../../reskin/colors.json';

export default class PosterRailItem extends FocusableItem {
  _props = {
    imageSrc: '',
    placeholderSrc: Utils.asset(IMG_PATH.EMPTY_RAIL_PH),
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
            text: 'Title',
            fontFace: 'Montserrat-Regular',
            fontSize: 18,
            lineHeight: 22,
            maxLines: 1,
            wordWrapWidth: 273,
            maxLinesSuffix: '...',
          },
        },
      },
    };
  }

  get _Title() {
    return this.tag('Title');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { imageSrc, radius, itemTitle, placeholderSrc, orientation } = this._props;

    this.setProps({
      width:
        orientation === 'landscape'
          ? CARD_SIZES.POSTER.landscape_image_width
          : CARD_SIZES.POSTER.poster_image_width,
      height:
        orientation === 'landscape'
          ? CARD_SIZES.POSTER.landscape_image_height
          : CARD_SIZES.POSTER.poster_image_height,
    });

    this.patch({
      w:
        orientation === 'landscape'
          ? CARD_SIZES.POSTER.landscape_width
          : CARD_SIZES.POSTER.poster_width,
      h:
        orientation === 'landscape'
          ? CARD_SIZES.POSTER.landscape_container_height
          : CARD_SIZES.POSTER.poster_container_height,
      Wrapper: {
        Border: {
          PosterImage: {
            props: {
              width:
                orientation === 'landscape'
                  ? CARD_SIZES.POSTER.landscape_image_width
                  : CARD_SIZES.POSTER.poster_image_width,
              height:
                orientation === 'landscape'
                  ? CARD_SIZES.POSTER.landscape_image_height
                  : CARD_SIZES.POSTER.poster_image_height,
              imageSrc: imageSrc,
              placeholderSrc: placeholderSrc,
              radius: radius,
            },
          },
        },
        Title: {
          text: {
            text: itemTitle,
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
    if (window.Didomi && window.Didomi.notice.isVisible()) {
      return true;
    }
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

import { CARD_SIZES, IMG_PATH } from '../../constants/globalConstants';

import { Utils, Colors } from '@lightningjs/sdk';
import FocusableItem from '../FocusableItem/FocusableItem';
import colors from '../../../reskin/colors.json';
import Image from '../Image/Image';

export default class CollectionRailItem extends FocusableItem {
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
      w: CARD_SIZES.COLLECTION.width,
      h: CARD_SIZES.COLLECTION.container_height,
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
          w: 410,
          text: {
            text: 'Title',
            fontFace: 'Montserrat-Regular',
            fontSize: 18,
            lineHeight: 22,
            maxLines: 2,
            maxLinesSuffix: '...',
            wordWrapWidth: 410,
          },
        },
      },
    };
  }

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  get _Title() {
    return this.tag('Title');
  }

  get _PosterImage() {
    return this.tag('PosterImage');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { imageSrc, radius, itemTitle, placeholderSrc } = this._props;

    this.setProps({
      width: CARD_SIZES.COLLECTION.image_width,
      height: CARD_SIZES.COLLECTION.image_height,
    });

    this._Wrapper.patch({
      Border: {
        PosterImage: {
          props: {
            width: CARD_SIZES.COLLECTION.image_width,
            height: CARD_SIZES.COLLECTION.image_height,
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
    const { index } = this._props;
    this.fireAncestors('$handleItemHover', index);
    super._focus();
  }
}

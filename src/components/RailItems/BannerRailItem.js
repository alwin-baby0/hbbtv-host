import { CARD_SIZES } from './constants';
import { Utils } from '@lightningjs/sdk';
import FocusableItem from '../FocusableItem/FocusableItem';
import Image from '../Image/Image';
import { IMG_PATH } from '../../constants/globalConstants';

export default class BannerRailItem extends FocusableItem {
  _props = {
    imageSrc: '',
    placeholderSrc: Utils.asset(IMG_PATH.EMPTY_RAIL_PH),
    radius: 6,
    strokeWidth: 4,
    callback: () => null,
  };

  static _template() {
    return {
      ...super._template(),
      w: CARD_SIZES.BANNER.width,
      h: CARD_SIZES.BANNER.height,
      flex: { direction: 'row', justifyContent: 'center', alignItems: 'center' },
      Wrapper: {
        w: 1760,
        h: 260,
        Border: {
          flex: { justifyContent: 'center', alignItems: 'center' },
          PosterImage: {
            type: Image,
          },
        },
      },
    };
  }

  get _Title() {
    return this.tag('Title');
  }

  get _PosterImage() {
    return this.tag('PosterImage');
  }

  set props(props) {
    this._props = { ...this._props, ...props };

    this.setProps({
      width: CARD_SIZES.BANNER.image_width,
      height: CARD_SIZES.BANNER.image_height,
    });

    const { imageSrc, radius, placeholderSrc } = this._props;
    this._PosterImage.patch({
      props: {
        width: CARD_SIZES.BANNER.image_width,
        height: CARD_SIZES.BANNER.image_height,
        imageSrc: imageSrc,
        placeholderSrc: placeholderSrc,
        radius: radius,
      },
    });
  }

  _handleEnter() {
    const { callback } = this._props;
    callback();
  }
}

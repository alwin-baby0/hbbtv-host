import { CARD_SIZES } from './constants';
import { Utils } from '@lightningjs/sdk';
import FocusableItem from '../FocusableItem/FocusableItem';
import Image from '../Image/Image';

export default class BannerRailItem extends FocusableItem {
  _props = {
    imageSrc: '',
    placeholderSrc: Utils.asset('images/rail-placeholder-empty.png'),
    radius: 6,
    strokeWidth: 4,
    callback: () => null,
  };

  static _template() {
    return {
      ...super._template(),
      w: CARD_SIZES.BANNER.width,
      h: CARD_SIZES.BANNER.height - 30, // todo: find better solution
      // flex: { direction: 'row', justifyContent: 'center', alignItems: 'center' },
      Wrapper: {
        flex: { direction: 'column' },
        w: 1760,
        h: 150,
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
    this.setProps({
      width: CARD_SIZES.BANNER.image_width,
      height: CARD_SIZES.BANNER.image_height,
    });

    const { imageSrc, radius, itemTitle, placeholderSrc } = this._props;

    this._PosterImage.patch({
      props: {
        width: CARD_SIZES.BANNER.image_width,
        height: CARD_SIZES.BANNER.image_height,
        // imageSrc: imageSrc,
        imageSrc: 'https://cdn-images.watch4.com/360/3/1765501.jpg?1728370221',
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

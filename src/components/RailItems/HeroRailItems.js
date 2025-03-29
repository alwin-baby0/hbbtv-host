import { Colors, Utils } from '@lightningjs/sdk';
import { CARD_SIZES } from './constants';
import colors from '../../../reskin/colors.json';
import FocusableItem from '../FocusableItem/FocusableItem';
import Image from '../Image/Image';

export default class HeroRailItem extends FocusableItem {
  _props = {
    imageSrc: '',
    placeholderSrc: Utils.asset('images/landscape-rail-placeholder.png'),
    radius: 6,
    strokeWidth: 4,
    callback: () => null,
    index: 0,
  };
  static _template() {
    return {
      ...super._template(),
      color: Colors(colors.landscapeBackground).get(),
      rect: true,
      shader: {
        type: lng.shaders.RoundedRectangle,
        radius: 6,
      },
      w: CARD_SIZES.HERO.width,
      h: CARD_SIZES.HERO.height,
      Wrapper: {
        flex: { direction: 'column' },
        Border: {
          flex: { justifyContent: 'center', alignItems: 'center' },
          LandscapeImage: {
            type: Image,
          },
        },
      },
    };
  }

  get _LandscapeImage() {
    return this.tag('LandscapeImage');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { imageSrc, radius, placeholderSrc } = this._props;

    this.setProps({
      width: 385,
      height: 215,
      color: '#D9D9D9',
    });

    this._LandscapeImage.patch({
      props: {
        width: CARD_SIZES.HERO.image_width,
        height: CARD_SIZES.HERO.image_height,
        imageSrc: imageSrc,
        placeholderSrc: placeholderSrc,
        radius: radius,
      },
    });
  }

  _focus() {
    super._focus();
    const { index, url } = this._props;

    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }
    this._timeoutId = setTimeout(() => {
      this.fireAncestors('$punchHoleTV', 700, 0, 1220, 685, 0);
      this.fireAncestors('$playTrailer', { trailer: url });
    }, 3000);
    this.fireAncestors('$nextVideo', index);
  }

  _unfocus() {
    super._unfocus();
    this.fireAncestors('$unpunchHole');

    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
    }
    this.fireAncestors('$stopVideo');
  }

  _handleEnter() {
    const { callback } = this._props;
    this.fireAncestors('$stopVideo');
    callback();
  }
}

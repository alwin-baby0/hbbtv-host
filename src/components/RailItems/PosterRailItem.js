import { CARD_SIZES } from './constants';
import { Utils, Router } from '@lightningjs/sdk';
import FocusableItem from '../FocusableItem/FocusableItem';
import Image from '../Image/Image';

export default class PosterRailItem extends FocusableItem {
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
      w: CARD_SIZES.POSTER.width,
      h: CARD_SIZES.POSTER.height - 30, // todo: find better solution
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
            maxLines: 2,
            wordWrapWidth: 273,
            maxLinesSuffix: '...',
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
      width: CARD_SIZES.POSTER.image_width,
      height: CARD_SIZES.POSTER.image_height,
    });

    this._Wrapper.patch({
      Border: {
        PosterImage: {
          props: {
            width: CARD_SIZES.POSTER.image_width,
            height: CARD_SIZES.POSTER.image_height,
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
    Router.focusPage();
    const { index } = this._props;
    // const ancestor = this.parent.parent.parent.parent;
    this.fireAncestors('$handleItemHover', index);
    this._focus();

    // if (ancestor.ref === 'RecentlyWatched') {
    //   this.fireAncestors('$setStateOnHover', 'RecentlyWatched');
    // }
    // if (ancestor.ref === 'Favorites') {
    //   this.fireAncestors('$setStateOnHover', 'Favorites');
    // }
    // if (ancestor.parent.parent.ref === 'QRContainer') {
    //   this.fireAncestors(
    //     '$setStateOnHover',
    //     ancestor.parent.ref === 'RecentlyWatched' ? 'UserRecentlyWatched' : 'UserFavorites'
    //   );
    // }
  }

  // _handleUnhover() {
  //   super._unfocus();
  // }
}

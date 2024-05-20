// PosterRailItem
import FocusableItem from '../FocusableItem/FocusableItem';
import { CARD_SIZES } from './constants';

export default class PosterRailItem extends FocusableItem {
  _props = {
    imageSrc: '',
    radius: 6,
    strokeWidth: 4,
  };
  static _template() {
    return {
      ...super._template(),
      Wrapper: {
        flex: { direction: 'column' },
        Border: {
          flex: { justifyContent: 'center', alignItems: 'center' },
          MovieImg: {
            rect: true,
          },
        },
        Title: {
          y: 15,
          h: 45,
          w: 265,
          text: {
            text: 'Title',
            fontFamily: 'Inter',
            fontSize: 18,
            lineHeight: 22,
            maxLines: 2,
            wordWrapWidth: 265,
          },
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { imageSrc, radius, itemTitle } = this._props;

    this.setProps({
      ...CARD_SIZES.POSTER,
    });

    this.tag('Title').patch({
      text: {
        text: itemTitle,
      },
    });

    this.tag('MovieImg').patch({
      w: CARD_SIZES.POSTER.width,
      h: CARD_SIZES.POSTER.height,
      src: imageSrc,
      shader: {
        type: lng.shaders.RoundedRectangle,
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
}

import { Colors } from '@lightningjs/sdk';
import { CARD_SIZES } from './constants';
import colors from '../../../reskin/colors.json';
import FocusableItem from '../FocusableItem/FocusableItem';

export default class LandscapeRailItem extends FocusableItem {
  _props = {
    imageSrc: '',
    radius: 6,
    strokeWidth: 4,
    callback: () => null,
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
      w: CARD_SIZES.LANDSCAPE.width,
      h: CARD_SIZES.LANDSCAPE.height,
      Wrapper: {
        flex: { direction: 'column' },
        Border: {
          flex: { justifyContent: 'center', alignItems: 'center' },
          MovieImg: {
            w: CARD_SIZES.LANDSCAPE.width,
            rect: true,
          },
        },
        Title: {
          h: 25,
          flexItem: {
            marginTop: 15,
            marginLeft: 20,
            marginRight: 20,
          },
          text: {
            fontFamily: 'Inter',
            fontSize: 21,
            lineHeight: 25,
            maxLines: 1,
            wordWrapWidth: 275,
          },
        },
        Description: {
          h: 160,
          w: 275,
          flexItem: {
            marginTop: 5,
            marginLeft: 20,
            marginRight: 20,
          },
          text: {
            fontFamily: 'Inter',
            fontSize: 16,
            lineHeight: 20,
            wordWrapWidth: 275,
          },
        },
      },
    };
  }

  get _Title() {
    return this.tag('Title');
  }

  get _Description() {
    return this.tag('Description');
  }

  get _MovieImg() {
    return this.tag('MovieImg');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { imageSrc, radius, itemTitle, itemDescription } = this._props;

    this.setProps({
      width: 315,
      height: 410,
    });

    this._Title.patch({
      text: {
        text: itemTitle,
      },
    });

    this._Description.patch({
      text: {
        text: itemDescription || '',
      },
    });

    this._MovieImg.patch({
      w: CARD_SIZES.LANDSCAPE.image_width,
      h: CARD_SIZES.LANDSCAPE.image_height,
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

  _handleEnter() {
    const { callback } = this._props;
    callback();
  }
}

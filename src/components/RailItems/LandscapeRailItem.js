import { Colors, Utils, Lightning } from '@lightningjs/sdk';
import { CARD_SIZES, IMG_PATH } from '../../constants/globalConstants';
import colors from '../../../reskin/colors.json';
import FocusableItem from '../FocusableItem/FocusableItem';
import Image from '../Image/Image';

export default class LandscapeRailItem extends FocusableItem {
  _props = {
    imageSrc: '',
    placeholderSrc: Utils.asset(IMG_PATH.LANDSCAPE_RAIL_PH_EMPTY),
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
      color: Colors(colors.landscapeBackground).get(),
      rect: true,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 6,
      },
      w: CARD_SIZES.LANDSCAPE.width,
      h: CARD_SIZES.LANDSCAPE.container_height,
      Wrapper: {
        flex: { direction: 'column' },
        Border: {
          flex: { alignItems: 'center' },
          LandscapeImage: {
            type: Image,
          },
        },
        Title: {
          h: 60,
          flexItem: {
            marginTop: 15,
            marginLeft: 20,
            marginRight: 20,
          },
          text: {
            fontFace: 'Montserrat-Bold',
            fontSize: 24,
            lineHeight: 25,
            maxLines: 2,
            maxLinesSuffix: '...',
            wordWrapWidth: 400,
          },
        },
        Description: {
          h: 140,
          w: 415,
          flexItem: {
            marginLeft: 20,
            marginRight: 20,
          },
          text: {
            fontFace: 'Montserrat-Regular',
            fontSize: 18,
            lineHeight: 25,
            wordWrapWidth: 385,
            maxLines: 5,
            maxLinesSuffix: '...',
            textColor: Colors('#cccccf').get(),
          },
        },
        Summary: {
          h: 30,
          w: 400,
          flexItem: {
            marginLeft: 20,
            marginRight: 20,
          },
          text: {
            fontFace: 'Montserrat-Regular',
            fontSize: 18,
            wordWrapWidth: 385,
            maxLines: 1,
            textColor: Colors('#868687').get(),
          },
        },
      },
    };
  }

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { imageSrc, radius, itemTitle, placeholderSrc, itemSummary, durationString, year } =
      this._props;

    const durYear = [durationString, year].join(`${durationString && year ? ' | ' : ''}`);

    this.setProps({
      width: CARD_SIZES.LANDSCAPE.width,
      height: CARD_SIZES.LANDSCAPE.container_height,
    });

    this._Wrapper.patch({
      Border: {
        LandscapeImage: {
          props: {
            width: CARD_SIZES.LANDSCAPE.image_width,
            height: CARD_SIZES.LANDSCAPE.image_height,
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
      Description: {
        text: {
          text: itemSummary || '',
        },
      },
      Summary: {
        text: {
          text: durYear,
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

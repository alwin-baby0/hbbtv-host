import { Colors, Utils, Router, Lightning } from '@lightningjs/sdk';
import { CARD_SIZES, IMG_PATH } from '../../constants/globalConstants';
import colors from '../../../reskin/colors.json';
import FocusableItem from '../FocusableItem/FocusableItem';
import Image from '../Image/Image';

export default class SportsEventsRailItem extends FocusableItem {
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
      rect: true,
      w: CARD_SIZES.SPORTS.width,
      h: CARD_SIZES.SPORTS.height,
      color: Colors(colors.eventCardBackground).get(),
      EventImage: {
        x: 3,
        y: 3,
        type: Image,
      },
      EventTime: {
        x: 3,
        y: 175,
        rect: true,
        h: 40,
        color: Colors(colors.focus).get(),
        shader: {
          type: Lightning.shaders.RoundedRectangle,
          radius: [0, 4, 4, 0],
        },
        flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
        DateTime: {
          flexItem: { marginLeft: 13, marginRight: 13 },
          h: 16,
          text: {
            text: '',
            fontFace: 'Montserrat-SemiBold',
            fontSize: 16,
            lineHeight: 16,
          },
        },
      },
      DescriptionWrapper: {
        x: 3,
        y: 213,
        w: 350,
        h: 165,
        flex: { direction: 'column' },
        Title: {
          flexItem: {
            marginTop: 15,
            marginLeft: 21,
          },
          text: {
            text: '',
            fontFace: 'Montserrat-Bold',
            fontSize: 20,
            lineHeight: 24,
            wordWrapWidth: 270,
            maxLines: 3,
            maxLinesSuffix: '...',
          },
        },
        // Description: {
        //   flexItem: {
        //     marginTop: 4,
        //     marginLeft: 21,
        //   },
        //   text: {
        //     fontFace: 'Montserrat-Regular',
        //     fontSize: 16,
        //     lineHeight: 20,
        //     wordWrapWidth: 300,
        //     maxLines: 4,
        //     maxLinesSuffix: '...',
        //   },
        // },
      },
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 9,
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const {
      itemTitle,
      itemDescription,
      itemDateWithTime,
      imageSrc,
      placeholderSrc,
      radius,
      strokeWidth,
    } = this._props;

    this.setProps({
      width: CARD_SIZES.SPORTS.width,
      height: CARD_SIZES.SPORTS.height,
      radius: radius,
      strokeWidth: strokeWidth,
    });

    this.patch({
      EventImage: {
        props: {
          width: 342,
          height: 192,
          imageSrc: imageSrc,
          placeholderSrc: placeholderSrc,
          radius: [6, 6, 0, 0],
        },
      },
      EventTime: {
        DateTime: {
          text: { text: itemDateWithTime },
        },
      },
      DescriptionWrapper: {
        Title: {
          text: { text: itemTitle },
        },
        // Description: {
        //   text: { text: itemDescription },
        // },
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
    if (window.Didomi && window.didomiVisible) {
      return true;
    }
    const { callback } = this._props;
    callback();
  }

  _handleHover() {
    if (!Router.isNavigating()) {
      Router.focusPage();
    }
    const { index } = this._props;
    this.fireAncestors('$handleItemHover', index);
    super._focus();
  }

  _handleClick() {
    const { callback } = this._props;
    callback();
  }
}

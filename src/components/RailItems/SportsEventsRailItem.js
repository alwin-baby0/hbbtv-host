import { Colors, Utils } from '@lightningjs/sdk';
import { CARD_SIZES } from './constants';
import colors from '../../../reskin/colors.json';
import FocusableItem from '../FocusableItem/FocusableItem';
import Image from '../Image/Image';

export default class SportsEventsRailItem extends FocusableItem {
  _props = {
    imageSrc: '',
    placeholderSrc: Utils.asset('images/landscape-rail-placeholder-empty.png'),
    radius: 6,
    strokeWidth: 4,
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
        y: 180,
        rect: true,
        h: 30,
        color: Colors(colors.focus).get(),
        shader: {
          type: lng.shaders.RoundedRectangle,
          radius: [0, 4, 4, 0],
        },
        flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
        DateTime: {
          flexItem: { marginLeft: 10, marginRight: 10 },
          h: 16,
          text: {
            text: '',
            fontFace: 'Montserrat-SemiBold',
            fontSize: 13,
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
            lineHeight: 16,
            wordWrapWidth: 270,
          },
        },
        Description: {
          flexItem: {
            marginTop: 4,
            marginLeft: 21,
          },
          text: {
            fontFace: 'Montserrat-Regular',
            fontSize: 16,
            lineHeight: 16,
            wordWrapWidth: 300,
            maxLines: 8,
          },
        },
      },
      shader: {
        type: lng.shaders.RoundedRectangle,
        radius: 9,
      },
    };
  }

  get _Title() {
    return this.tag('Title');
  }

  get _DescriptionWrapper() {
    return this.tag('DescriptionWrapper');
  }

  get _DateTime() {
    return this.tag('DateTime');
  }

  get _EventImage() {
    return this.tag('EventImage');
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
        Description: {
          text: { text: itemDescription },
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

  _handleHover() {
    const { index } = this._props;
    super._focus();
    this.fireAncestors('$horizontalPosterIndexChange', index);
  }

  _handleUnhover() {
    super._unfocus();
  }

  _handleClick() {
    const { callback } = this._props;
    callback();
  }
}

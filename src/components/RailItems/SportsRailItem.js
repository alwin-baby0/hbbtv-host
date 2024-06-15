import { Colors } from '@lightningjs/sdk';
import { CARD_SIZES } from './constants';
import FocusableItem from '../FocusableItem/FocusableItem';

export default class SportsRailItem extends FocusableItem {
  _props = {
    imageSrc: '',
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
      color: Colors('#23273A').get(),
      EventImage: {
        x: 3,
        y: 3,
        w: 255,
        h: 150,
        shader: {
          type: lng.shaders.RoundedRectangle,
          radius: [6, 6, 0, 0],
        },
      },
      EventTime: {
        x: 3,
        y: 137,
        rect: true,
        w: 180,
        h: 30,
        color: Colors('#A61619').get(),
        shader: {
          type: lng.shaders.RoundedRectangle,
          radius: [0, 4, 4, 0],
        },
        flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
        DateTime: {
          w: 170,
          h: 16,
          text: {
            text: '',
            fontFamily: 'Inter',
            fontStyle: 'normal bold',
            fontSize: 13,
            lineHeight: 16,
          },
        },
      },
      Description: {
        x: 3,
        y: 170,
        w: 255,
        h: 165,
        flex: { direction: 'column' },
        Title: {
          flexItem: {
            marginTop: 15,
            marginLeft: 21,
          },
          text: {
            text: '',
            fontFamily: 'Inter',
            fontStyle: 'normal bold',
            fontSize: 13,
            lineHeight: 16,
            wordWrapWidth: 220,
          },
        },
        Descriptionn: {
          flexItem: {
            marginTop: 4,
            marginLeft: 21,
          },
          text: {
            fontFamily: 'Inter',
            fontStyle: 'normal [100]',
            fontSize: 11,
            lineHeight: 16,
            wordWrapWidth: 220,
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

  get _Description() {
    return this.tag('Descriptionn');
  }

  get _DateTime() {
    return this.tag('DateTime');
  }

  get _EventImage() {
    return this.tag('EventImage');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { itemTitle, itemDescription, itemDateWithTime, imageSrc, radius, strokeWidth } =
      this._props;

    this.setProps({
      width: CARD_SIZES.SPORTS.width,
      height: CARD_SIZES.SPORTS.height,
      radius: radius,
      strokeWidth: strokeWidth,
    });

    this._Title.patch({
      text: {
        text: itemTitle,
      },
    });

    this._Description.patch({
      text: {
        text: itemDescription,
        fontSize: 11,
      },
    });

    this._DateTime.patch({
      text: {
        text: itemDateWithTime,
      },
    });

    this._EventImage.patch({
      src: imageSrc,
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

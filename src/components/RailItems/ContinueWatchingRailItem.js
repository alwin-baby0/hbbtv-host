import { Colors, Router, Utils, Lightning } from '@lightningjs/sdk';
import { CARD_SIZES, IMG_PATH } from '../../constants/globalConstants';

import colors from '../../../reskin/colors.json';
import FocusableItem from '../FocusableItem/FocusableItem';
import Image from '../Image/Image';
import ProgressBar from '../../pages/Player/components/ProgressBar/ProgressBar';

export default class ContinueWatchingRailItem extends FocusableItem {
  _props = {
    imageSrc: '',
    placeholderSrc: Utils.asset(IMG_PATH.LANDSCAPE_RAIL_PH),
    radius: 6,
    strokeWidth: 4,
    x: -2,
    y: -2,
    strokeColor: Colors(colors.focus).get(),
    callback: () => null,
    index: 0,
    enableProgressBar: false,
  };

  static _template() {
    return {
      ...super._template(),
      color: Colors(colors.landscapeBackground).get(),
      rect: true,
      zIndex: 3,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 6,
      },
      w: CARD_SIZES.CONTINUE_WATCHING.width,
      h: CARD_SIZES.CONTINUE_WATCHING.height,
      Wrapper: {
        flex: { direction: 'column' },
        Border: {
          flex: { justifyContent: 'center', alignItems: 'center' },
          LandscapeImage: {
            type: Image,
          },
        },
        PlayButton: {
          color: Colors(colors.unfocus).alpha(0.6).get(),
          texture: Lightning.Tools.getSvgTexture(Utils.asset(IMG_PATH.PLAY_BTN_PLAYER), 30, 30),
          y: -70,
          x: 20,
          w: 30,
          h: 30,
          visible: false,
        },
        ProgressBar: {
          y: -60,
          type: ProgressBar,
          visible: false,
          props: {
            width: CARD_SIZES.CONTINUE_WATCHING.width - 40,
            height: 7,
            flexItem: {
              marginLeft: 20,
              marginRight: 20,
            },
            progressColor: colors.focus,
            backgroundBarColor: colors.unfocus,
            alpha: 0.6,
          },
        },
        Title: {
          h: 45,
          w: 273,
          y: -20,
          text: {
            text: 'Title',
            fontFace: 'Montserrat-Regular',
            fontSize: 18,
            lineHeight: 22,
            maxLines: 1,
            wordWrapWidth: 273,
            maxLinesSuffix: '...',
          },
        },
      },
    };
  }

  get _ProgressBar() {
    return this.tag('ProgressBar');
  }

  get _PlayButton() {
    return this.tag('PlayButton');
  }

  get Title() {
    return this.tag('Title');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { imageSrc, radius, placeholderSrc, enableProgressBar, itemTitle, duration, position } =
      this._props;

    this.setProps({
      width: 385,
      height: 215,
    });

    this._PlayButton.visible = enableProgressBar;
    this._ProgressBar.visible = enableProgressBar;
    enableProgressBar && this._ProgressBar.progress(position / duration);

    this.patch({
      Wrapper: {
        Border: {
          LandscapeImage: {
            props: {
              width: CARD_SIZES.CONTINUE_WATCHING.image_width,
              height: CARD_SIZES.CONTINUE_WATCHING.image_height,
              imageSrc: imageSrc,
              placeholderSrc: placeholderSrc,
              radius: radius,
            },
          },
        },
        Title: {
          ...(!enableProgressBar && { y: 20 }),
          text: {
            text: itemTitle,
          },
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
    if (!Router.isNavigating()) {
      Router.focusPage();
    }
    const { index } = this._props;
    this.fireAncestors('$handleItemHover', index);
    this._focus();
  }
}

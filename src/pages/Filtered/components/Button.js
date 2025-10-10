import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import colors from '../../../../reskin/colors.json';

export default class Button extends Lightning.Component {
  _props = {
    itemInfo: null,
    callback: () => null,
  };

  static _template() {
    return {
      collision: true,
      w: 170,
      h: 64,
      flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
      Icon: {
        x: -10,
        zIndex: 10,
        texture: Lightning.Tools.getSvgTexture(Utils.asset('icons/arrowLeft.svg'), 15, 15),
        color: Colors(colors.unfocus).get(),
      },
      Title: {
        x: 10,
        h: 24,
        text: {
          fontSize: 20,
          lineHeight: 25,
          fontFace: 'Montserrat-Bold',
        },
      },
    };
  }

  get _Title() {
    return this.tag('Title');
  }

  get _Icon() {
    return this.tag('Icon');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { itemInfo, w, h } = this._props;
    const { title } = itemInfo;
    this.patch({
      w,
      h,
      flexItem: {
        shrink: false,
      },
      Title: {
        text: {
          text: title.toUpperCase(),
          textColor: Colors(colors.focus).get(),
        },
      },
    });
  }

  _focus() {
    const { w, h, radius, strokeWidth } = this._props;
    this.patch({
      Icon: {
        color: Colors(colors.focus).get(),
      },
      texture: radius
        ? Lightning.Tools.getRoundRect(
            w,
            h,
            radius,
            strokeWidth,
            Colors(colors.focus).get(),
            true,
            Colors(colors.focus).get()
          )
        : {},
      Title: {
        text: {
          textColor: Colors(colors.unfocus).get(),
        },
      },
    });
  }

  _unfocus() {
    const { w, h, radius, strokeWidth } = this._props;
    this.patch({
      texture: radius
        ? Lightning.Tools.getRoundRect(
            w,
            h,
            radius,
            strokeWidth,
            Colors(colors.focusedHelpButton).get(),
            true,
            Colors(colors.focusedHelpButton).get()
          )
        : {},
      Title: {
        text: {
          textColor: Colors(colors.focus).get(),
        },
      },
      Icon: {
        color: Colors(colors.unfocus).get(),
      },
    });
  }

  _handleHover() {
    this._focus();
  }

  _handleUnhover() {
    this._unfocus();
  }

  async _handleClick() {
    this._handleEnter();
  }

  async _handleEnter() {
    const routerHistory = Router.getHistory().filter(
      (history) => history !== 'splash' && history != 'cmp'
    );
    if (routerHistory.length) {
      Router.back();
    } else {
      Router.navigate('home');
    }
  }
}

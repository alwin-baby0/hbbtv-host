import lng from '@lightningjs/core';
import { Colors, Router, Utils } from '@lightningjs/sdk';
import colors from '../../../../../reskin/colors.json';

export default class SidebarItem extends lng.Component {
  _props = {
    selected: false,
  };

  static _template() {
    return {
      flex: { direction: 'column', alignItems: 'center' },
      w: 150,
      h: 70,
      Title: {
        y: 21,
        text: {
          textColor: Colors(colors.unfocus).get(),
          fontSize: 24,
          lineHeight: 27,
          fontFace: 'Montserrat-Bold',
        },
      },
      Icon: {
        y: 10,
        zIndex: 0,
        color: Colors(colors.unfocus).get(),
      },
      Line: {
        y: 21,
        w: 150,
        h: 5,
        rect: true,
        shader: { type: lng.shaders.RoundedRectangle },
        visible: false,
      },
    };
  }

  getSelectedIndex() {
    if (this._props.selected) {
      return this._props.index;
    }
    return -1;
  }

  set props(props) {
    this._props = {
      ...this._props,
      ...props,
    };

    const { selected, index } = this._props;
    const { label, icon } = this._props.data;
    if (selected) {
      this.patch({
        Title: {
          color: Colors(colors.focus).get(),
        },
        Line: {
          color: Colors(colors.focus).get(),
        },
        Icon: {
          color: Colors(colors.focus).get(),
        },
      });
    } else {
      this.patch({
        Title: {
          color: Colors(colors.unfocus).get(),
        },
        Line: {
          color: Colors(colors.unfocus).get(),
        },
        Icon: {
          color: Colors(colors.unfocus).get(),
        },
      });
    }

    if (icon !== '') {
      this.patch({
        Line: {
          x: 200,
          y: 21,
          w: 0,
        },
        Icon: {
          texture: lng.Tools.getSvgTexture(Utils.asset(icon), 48, 48),
        },
      });
    } else {
      this.patch({
        w: index === 4 && label.length > 10 ? 200 : 150,
        Title: {
          text: {
            maxLines: 1,
            wordWrapWidth: index === 4 && label.length > 10 ? 200 : 150,
            fontFace: 'Montserrat-Regular',
            text: label.toUpperCase(),
          },
        },
      });
    }
  }

  get _Icon() {
    return this.tag('Icon');
  }

  get _Title() {
    return this.tag('Title');
  }

  get _Line() {
    return this.tag('Line');
  }

  _focus() {
    const { index } = this._props;
    const { label, icon } = this._props.data;

    setTimeout(() => {
      this.patch({
        Line: {
          w: index === 4 && label.length > 10 ? 200 : icon === '' ? 150 : this._Line.w, // čuva trenutnu širinu ako uslovi nisu zadovoljeni,
          visible: true,
        },
        Icon: {
          color: Colors(colors.focus).get(),
        },
      });
    }, 0);
  }

  _unfocus() {
    this.patch({
      Icon: {
        color: Colors(colors.unfocus).get(),
      },
      Title: {
        text: {
          textColor: Colors(colors.unfocus).get(),
        },
      },
      Line: {
        visible: false,
      },
    });
  }

  fja() {
    const event = new CustomEvent('verticalIndexReset');
    window.dispatchEvent(event);
  }

  _handleRight() {
    this.fireAncestors('$incrementSidebar');
  }

  _handleLeft() {
    this.fireAncestors('$decrementSidebar');
  }

  _handleEnter() {
    this.fja();
    this.fireAncestors('$changePage', this._props.index);
    Router.focusPage();
  }

  _handleHover() {
    this._focus();
    this.fireAncestors('$changeHoverFocus', this._props.index);
    Router.focusWidget('Menu');
  }

  _handleUnhover() {
    this._unfocus();
  }

  _handleClick() {
    this.fja();
    this.fireAncestors('$changePage', this._props.index);
    Router.focusPage();
  }
}

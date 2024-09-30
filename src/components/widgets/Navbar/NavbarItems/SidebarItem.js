import lng from '@lightningjs/core';
import { Colors, Language, Router, Utils } from '@lightningjs/sdk';
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
        // x: 380,
        x: 330,
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
    const translatedText = Language.translate(label);
    console.log('home index', index);
    if (selected) {
      this._Title.patch({ color: Colors(colors.focus).get() });
      this._Line.patch({ color: Colors(colors.focus).get() });
      this._Icon.patch({
        color: Colors(colors.focus).get(),
      });
    } else {
      this._Title.patch({ color: Colors(colors.unfocus).get() });
      this._Line.patch({ color: Colors(colors.unfocus).get() });
      this._Icon.patch({
        color: Colors(colors.unfocus).get(),
      });
    }

    if (icon !== '') {
      this._Line.patch({
        x: 200,
        y: 21,
        w: 0,
      });
      this._Icon.patch({
        texture: lng.Tools.getSvgTexture(Utils.asset(icon), 48, 48),
      });
    } else {
      this.patch({
        w: index === 4 && translatedText.length > 10 ? 200 : 150,
        Title: {
          text: {
            maxLines: 1,
            wordWrapWidth: index === 4 && translatedText.length > 10 ? 200 : 150,
            family: 'Montserrat-Regular',
            text: translatedText.toUpperCase(),
          },
        },
      });
      // this._Title.patch({
      //   text: {
      //     maxLines: 1,
      //     wordWrapWidth: 200,
      //     family: 'Montserrat-Regular',
      //     text: homeText.toUpperCase(),
      //   },
      // });
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

    // if (index === 4) {
    //   this._Line.patch({
    //     w: 200,
    //   });
    // } else if (icon === '') {
    //   this._Line.patch({
    //     w: 150,
    //   });
    // }
    const translatedText = Language.translate(label);
    this._Line.patch({
      w: index === 4 && translatedText.length > 10 ? 200 : icon === '' ? 150 : this._Line.w, // čuva trenutnu širinu ako uslovi nisu zadovoljeni
    });

    this._Line.visible = true;
    this._Icon.patch({
      color: Colors(colors.focus).get(),
    });
  }

  _unfocus() {
    this._Line.visible = false;
    if (!this._props.selected) {
      this._Icon.patch({
        color: Colors(colors.unfocus).get(),
      });
    }
  }

  _handleRight() {
    this.fireAncestors('$incrementSidebar');
  }

  _handleLeft() {
    this.fireAncestors('$decrementSidebar');
  }

  _handleEnter() {
    this.fireAncestors('$changePage', this._props.index);
    Router.focusPage();
    // Router.restoreFocus();
  }
}

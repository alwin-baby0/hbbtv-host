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
          fontStyle: 'normal bold',
        },
      },
      Icon: {
        x: 200,
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

    const { selected } = this._props;
    const { label, icon } = this._props.data;

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
      this._Title.patch({
        text: {
          text: label,
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
    Router.focusPage('MyListPage');
    // Router.restoreFocus();
  }
}

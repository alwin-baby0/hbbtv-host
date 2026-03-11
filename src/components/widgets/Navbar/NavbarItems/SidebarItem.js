import { Colors, Router, Utils, Lightning } from '@lightningjs/sdk';
import colors from '../../../../../reskin/colors.json';
import { LOCAL_STORAGE_KEYS, ROUTES } from '../../../../constants/globalConstants';
import { didomiVisible } from '../../../../App';

export default class SidebarItem extends Lightning.Component {
  _props = {
    selected: false,
    extraItemSpacing: 20,
    borderGap: 14,
    w: 170,
    h: 60,
    iconW: 60,
    radius: 16,
    isFocused: false,
  };

  static _template() {
    return {
      OuterStroke: {},
      FocusFill: {
        x: 7,
        y: 7,
        w: 60,
        h: 60,
        rect: true,
        color: null,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 14 },
        zIndex: 1,
      },
      Icon: {
        mountX: 0.5,
        mountY: 0.5,
        x: () => 74 / 2,
        y: () => 74 / 2,
        w: 40,
        h: 41,
        zIndex: 2,
      },
      Title: {
        mountX: 0.5,
        mountY: 0.5,
        x: (w) => (w + 12) / 2,
        y: (h) => (h + 18) / 2,
        text: {
          textColor: Colors(colors.unfocus).get(),
          fontFace: 'Montserrat-Bold',
          fontSize: 24,
          textAlign: 'center',
          wordWrapWidth: 100,
          maxLines: 1,
          maxLinesSuffix: '...',
        },
        zIndex: 2,
      },
    };
  }

  get _FocusFill() {
    return this.tag('FocusFill');
  }
  get _OuterStroke() {
    return this.tag('OuterStroke');
  }
  get _Icon() {
    return this.tag('Icon');
  }
  get _Title() {
    return this.tag('Title');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { selected, extraItemSpacing, w } = this._props;
    const { label, icon } = this._props.data || {};

    this.patch({ flexItem: { marginRight: extraItemSpacing } });

    if (icon) {
      this._Icon.patch({
        texture: Lightning.Tools.getSvgTexture(Utils.asset(icon), 32, 32),
        visible: true,
      });
    } else {
      this.patch({
        FocusFill: {
          w: w,
        },
      });
      this._Title.visible = true;
      this._Title.text.text = label.toUpperCase();
    }

    this._applyColors(selected);
  }

  _applyColors(selected) {
    if (this._props.isFocused) return;

    const textColor = selected ? Colors(colors.focus).get() : Colors(colors.unfocus).get();
    this._Title.text.textColor = textColor;
    this._Icon.color = textColor;
  }

  _focus() {
    this._props.isFocused = true;
    const { w, borderGap, iconW, radius } = this._props;

    const { icon } = this._props.data || {};

    this._FocusFill.color = Colors(colors.focus).get();
    this._Title.text.textColor = Colors(colors.white).get();
    this._Icon.color = Colors(colors.white).get();

    this._OuterStroke.patch({
      w: !icon ? w + borderGap : iconW + borderGap,
      h: iconW + borderGap,
      texture: Lightning.Tools.getRoundRect(
        !icon ? w + borderGap : iconW + borderGap,
        iconW + borderGap,
        radius,
        2,
        Colors(colors.focus).get(),
        false,
        0
      ),
    });
  }

  _unfocus() {
    this._props.isFocused = false;
    this._FocusFill.color = null;

    this._OuterStroke.patch({
      texture: null,
    });

    this._applyColors(this._props.selected);
  }

  fja() {
    const event = new CustomEvent('verticalIndexReset');
    window.dispatchEvent(event);
  }

  _handleEnter() {
    if (window.Didomi && didomiVisible) {
      return true;
    }

    this.fja();
    this.fireAncestors('$changePage', this._props.index);
    (this._props.data.route !== 'account' ||
      (this._props.data.route === 'account' &&
        localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA))) &&
      Router.focusPage();
  }

  _handleHover() {
    this._focus();
    this.fireAncestors('$handleItemHover', this.parent.children.indexOf(this));
    if (!Router.isNavigating()) {
      Router.focusWidget(ROUTES.MENU_WIDGET);
    }
  }

  _handleClick() {
    this._handleEnter();
  }
}

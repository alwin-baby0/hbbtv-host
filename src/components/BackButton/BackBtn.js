import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import { IMG_PATH, LOCAL_STORAGE_KEYS, ROUTES } from '../../constants/globalConstants';

export default class BackBtn extends Lightning.Component {
  _props = {
    parentState: null,
  };

  static _template() {
    return {
      Icon: {
        color: Colors('#ffffff'),
        texture: Lightning.Tools.getSvgTexture(Utils.asset(IMG_PATH.BACK_BTN), 80, 80),
      },
    };
  }

  get _Icon() {
    return this.tag('Icon');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
  }

  _focus() {
    this._Icon.patch({
      color: Colors(colors.focus).get(),
    });
  }

  _unfocus() {
    this._Icon.patch({
      color: Colors(colors.unfocus).get(),
    });
  }

  _handleEnter() {
    if (window.didomiVisible) {
      return true;
    }

    const router = Router.getHistory().filter(
      (history) => history.hash != ROUTES.SPLASH && history.hash != ROUTES.CMP
    );
    if (router.length) {
      Router.setHistory([...router]);
      Router.back();
    } else {
      Router.navigate(ROUTES.HOME);
    }
  }

  _handleHover() {
    this._focus();
    this.fireAncestors(
      '$handleStateHover',
      this.parent.children.indexOf(this),
      this._props.parentState
    );
  }

  _handleClick() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.EPISODE_ID_DETAIL);
    if (Router.isNavigating()) {
      return;
    }

    const router = Router.getHistory().filter(
      (history) => history.hash != ROUTES.SPLASH && history.hash != ROUTES.CMP
    );
    if (router.length) {
      Router.setHistory([...router]);
      Router.back();
    } else {
      Router.navigate(ROUTES.HOME);
    }
  }
}

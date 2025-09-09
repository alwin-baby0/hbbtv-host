import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';

export default class BackBtn extends Lightning.Component {
  static _template() {
    return {
      Icon: {
        color: Colors('#ffffff'),
        texture: Lightning.Tools.getSvgTexture(Utils.asset('icons/backbtn.svg'), 80, 80),
      },
    };
  }

  get _Icon() {
    return this.tag('Icon');
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
    const router = Router.getHistory().filter((history) => history.hash != 'splash');
    if (router.length) {
      Router.setHistory([...router]);
      Router.back();
    } else {
      Router.navigate('home');
    }
  }

  _handleHover() {
    this._focus();
  }

  _handleUnhover() {
    this._unfocus();
  }

  _handleClick() {
    Router.back();
  }
}

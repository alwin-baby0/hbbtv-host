import { Lightning, Router } from '@lightningjs/sdk';
import SidebarItems from './NavbarItems';
import { getRouteNavbarIndex } from '../../../utils/routesIndex';

export default class Navbar extends Lightning.Component {
  _visible = true;
  static _template() {
    return {
      Items: {
        type: SidebarItems,
        x: 40,
        y: 15,
        h: 70,
      },
    };
  }

  _active() {
    this.tag('Items').visible = this._visible;
  }

  _focus() {
    super._focus();
  }

  _unfocus() {
    super._unfocus();
  }

  _handleLeft() {
    return true;
  }

  _handleUp() {
    return true;
  }

  _getFocused() {
    return this.tag('Items');
  }
}

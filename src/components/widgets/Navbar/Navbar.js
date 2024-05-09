import { Lightning } from '@lightningjs/sdk';
import SidebarItems from './NavbarItems';

export default class Navbar extends Lightning.Component {
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

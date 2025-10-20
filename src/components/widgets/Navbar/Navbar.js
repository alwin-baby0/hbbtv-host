import { Lightning } from '@lightningjs/sdk';
import SidebarItems from './NavbarItems';

export let visibility = true;

export default class Navbar extends Lightning.Component {
  static _template() {
    return {
      Items: {
        type: SidebarItems,
        collision: true,
        x: 40,
        y: 15,
        h: 70,
      },
    };
  }

  set setVisibility(visible) {
    this.Items.visible = visible;
    visibility = visible;
  }

  get Items() {
    return this.tag('Items');
  }

  _handleLeft() {
    return true;
  }

  _handleUp() {
    return true;
  }

  _getFocused() {
    return this.Items;
  }
}

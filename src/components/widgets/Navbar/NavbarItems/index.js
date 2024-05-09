import Lightning from '@lightningjs/sdk/src/Lightning';
import { Row } from '@lightningjs/ui-components';
import { Colors, Router, Utils } from '@lightningjs/sdk';
import SidebarItem from './SidebarItem';
import colors from '../../../../../reskin/colors.json';

const menuItems = [
  { id: 0, label: 'Home', route: 'home', icon: '' },
  { id: 1, label: 'Movies', route: 'movies', icon: '' },
  { id: 2, label: 'Series', route: 'series', icon: '' },
  { id: 3, label: 'Sports', route: 'sports', icon: '' },
  { id: 4, label: 'Live TV', route: 'live', icon: '' },
  { id: 5, label: 'search', route: 'search', icon: 'images/navbar/search.svg' },
  { id: 6, label: 'settings', route: 'settings', icon: 'images/navbar/settings.svg' },
  { id: 7, label: 'terms', route: 'help', icon: 'images/navbar/question-mark.svg' },
];
let sidebarLength = menuItems.length;
let index = 0;

export default class SidebarItems extends Lightning.Component {
  _selectedMenuItem = 0;
  static _template() {
    return {
      flex: { direction: 'row', justifyContent: 'center', alignItems: 'center' },
      NavWrapper: {
        w: 1840,
        h: 70,
        Logo: {
          texture: Lightning.Tools.getSvgTexture(
            Utils.asset(`/images/navbar/nav-logo.svg`),
            235,
            70
          ),
        },
        Column: {
          type: Row,
          x: 550,
          h: 70,
          style: { itemSpacing: 30 },
          items: menuItems.map((item) => {
            return {
              type: SidebarItem,
              w: item.id < 5 ? 150 : 50,
              h: 70,
              props: { index: item.id, data: item },
              color: Colors(colors.unfocus).get(),
            };
          }),
        },
      },
    };
  }

  _init() {
    this._selectedLink = this._Column;
    this._Column.items[0].patch({
      props: { selected: true },
    });
  }

  _setManualFocus() {
    switch (Router.getActiveHash()) {
      case 'home':
        index = 0;
        return index;
      case 'movies':
        index = 1;
        return index;
      case 'series':
        index = 2;
        return index;
      case 'sports':
        index = 3;
        return index;
      case 'live':
        index = 4;
        return index;
      case 'search':
        index = 5;
        return index;
      case 'settings':
        index = 6;
        return index;
      case 'help':
        index = 7;
        return index;
      default:
        index = 8;
        return index;
    }
  }

  _incrementFocus() {
    return index < sidebarLength - 1 ? ++index : index;
  }

  _decrementFocus() {
    return index > 0 ? --index : index;
  }

  _focus() {
    this._selectedLink = this._Column.items[this._setManualFocus()];
  }

  $changePage(selectedItem) {
    const { route } = selectedItem.data;
    const { index } = selectedItem;

    // Check if the index is different from the current selected item
    if (this._selectedMenuItem !== index) {
      this._Column.items[index].patch({
        props: { selected: true },
      });
      this._Column.items[this._selectedMenuItem].patch({
        props: { selected: false },
      });
      this._selectedMenuItem = index;
    }
    Router.navigate(route);
  }

  $decrementSidebar() {
    this._selectedLink = this.tag('Column').items[this._decrementFocus()];
  }
  $incrementSidebar() {
    this._selectedLink = this.tag('Column').items[this._incrementFocus()];
  }
  get _Column() {
    return this.tag('Column');
  }
  _getFocused() {
    return this._selectedLink;
  }
}

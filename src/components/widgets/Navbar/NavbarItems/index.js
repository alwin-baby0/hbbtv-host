import Lightning from '@lightningjs/sdk/src/Lightning';
import { Row } from '@lightningjs/ui-components';
import { Colors, Router, Utils } from '@lightningjs/sdk';
import { getRouteNavbarIndex } from '../../../../utils/routesIndex';
import colors from '../../../../../reskin/colors.json';
import SidebarItem from './SidebarItem';

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

export default class SidebarItems extends Lightning.Component {
  _selectedMenuItem = 0;
  _sidebarLength = menuItems.length;
  _index = 0;

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
              props: {
                selected: false,
                index: item.id,
                data: item,
              },
              color: Colors(colors.unfocus).get(),
            };
          }),
        },
      },
    };
  }

  get _Column() {
    return this.tag('Column');
  }

  _firstActive() {
    this._index = getRouteNavbarIndex(Router.getActiveHash());
    this._Column.items[this._index].patch({
      props: {
        selected: true,
      },
    });
  }

  _unfocus() {
    this._index = this._selectedMenuItem;
  }

  $changePage(index) {
    const route = menuItems[index].route;

    if (this._selectedMenuItem !== index) {
      this._Column.items[index].patch({
        props: { selected: true },
      });
      this._Column.items[this._selectedMenuItem].patch({
        props: { selected: false },
      });

      this._selectedMenuItem = index;
      this._index = index;

      Router.navigate(route);
    }
  }

  $decrementSidebar() {
    this._index > 0 ? --this._index : this._index;
  }

  $incrementSidebar() {
    this._index < this._sidebarLength - 1 ? ++this._index : this._index;
  }

  _getFocused() {
    return this._Column.items[this._index];
  }
}

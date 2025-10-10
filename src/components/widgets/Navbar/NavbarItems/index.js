import Lightning from '@lightningjs/sdk/src/Lightning';
import { Row } from '@lightningjs/ui-components';
import { Colors, Router, Utils } from '@lightningjs/sdk';
import { getRouteNavbarIndex } from '../../../../utils/routesIndex';
import { VISIBLE_SPORT_COUNTRIES } from '../../../../constants/globalConstants';
import colors from '../../../../../reskin/colors.json';
import SidebarItem from './SidebarItem';
import { t } from '../../../../Services';
import { CountryService } from '../../../../Services';

export default class SidebarItems extends Lightning.Component {
  _selectedMenuItem = 0;
  _sidebarLength = 0;
  _index = 0;
  _newIndex = 0;
  _menuItemRoutes = [];
  _visibleSport = false;

  static _template() {
    return {
      NavWrapper: {
        w: 1840,
        h: 70,
        Logo: {
          w: 800 / 3.4,
          h: 215 / 3.4,
          src: Utils.asset('/images/navbar/logo.png'),
        },
        Column: {
          type: Row,
          collision: true,
          x: 300,
          h: 70,
          style: { itemSpacing: 30 },
        },
      },
    };
  }

  get _Column() {
    return this.tag('Column');
  }

  async _active() {
    const location = await CountryService.getCountry();
    this._visibleSport = VISIBLE_SPORT_COUNTRIES.includes(location.data.country.toLowerCase());

    // setTimeout is used to give time for url hash to change before asign the right one
    setTimeout(() => {
      const activeHash = Router.getActiveHash();
      // Check if activeHash contains both 'filtered' and 'movies'
      if (activeHash.includes('filterPage') && activeHash.includes('movie')) {
        this._index = getRouteNavbarIndex('filterPage/movie', this._visibleSport);
        this._setSelected(this._index);
        return;
      } else if (activeHash.includes('filterPage') && activeHash.includes('series')) {
        this._index = getRouteNavbarIndex('filterPage/series', this._visibleSport);
        this._setSelected(this._index);
        return;
      }
      this._index = getRouteNavbarIndex(Router.getActiveHash(), this._visibleSport);
      this._setSelected(this._index);
    });

    const menuItems = [
      { id: 0, label: t('home'), route: 'home', icon: '' },
      { id: 1, label: t('movies'), route: 'vod/movies', icon: '' },
      { id: 2, label: t('series'), route: 'vod/series', icon: '' },
    ];
    this._visibleSport
      ? menuItems.push(
          ...[
            { id: 3, label: t('sport'), route: 'vod/sports', icon: '' },
            { id: 4, label: t('live_tv'), route: 'live', icon: '' },
            { id: 5, label: 'search', route: 'search', icon: 'images/navbar/search.svg' },
            { id: 6, label: 'user', route: 'settings', icon: 'images/navbar/user.svg' },
            { id: 7, label: 'settings', route: 'langsettings', icon: 'images/navbar/settings.svg' },
            { id: 8, label: 'terms', route: 'help', icon: 'images/navbar/question-mark.svg' },
          ]
        )
      : menuItems.push(
          ...[
            { id: 3, label: t('live_tv'), route: 'live', icon: '' },
            { id: 4, label: 'search', route: 'search', icon: 'images/navbar/search.svg' },
            { id: 5, label: 'user', route: 'settings', icon: 'images/navbar/user.svg' },
            { id: 6, label: 'settings', route: 'langsettings', icon: 'images/navbar/settings.svg' },
            { id: 7, label: 'terms', route: 'help', icon: 'images/navbar/question-mark.svg' },
          ]
        );

    this._menuItemRoutes = menuItems.map((item) => item.route);

    this._sidebarLength = menuItems.length;

    this._Column.patch({
      items: menuItems.map((item) => {
        return {
          type: SidebarItem,
          collision: true,
          w: this._visibleSport ? (item.id < 5 ? 150 : 50) : item.id < 4 ? 150 : 50,
          h: 70,
          props: {
            selected: false,
            index: item.id,
            data: item,
          },
          extraItemSpacing: item.route === 'live' ? 270 : 0,
          color: Colors(colors.unfocus).get(),
        };
      }),
    });
  }

  _focus() {
    const activeHash = Router.getActiveHash();
    // Check if activeHash contains both 'filtered' and 'movies'
    if (activeHash?.includes('filterPage') && activeHash?.includes('movie')) {
      this._index = getRouteNavbarIndex('filterPage/movie', this._visibleSport);
      this._setSelected(this._index);
      return;
    } else if (activeHash?.includes('filterPage') && activeHash?.includes('series')) {
      this._index = getRouteNavbarIndex('filterPage/series', this._visibleSport);
      this._setSelected(this._index);
      return;
    }
    let focusedId = getRouteNavbarIndex(activeHash, this._visibleSport);
    this.$changePage(focusedId);
  }

  _setSelected(index) {
    this._Column.items.forEach((item, i) => {
      item.patch({
        props: {
          selected: i === index,
        },
      });
    });
  }

  $changePage(index) {
    const route = this._menuItemRoutes[index];
    this._setSelected(index);
    this._index = index;

    if (route) {
      Router.navigate(route);
    }
  }

  $changeHoverFocus(index) {
    this._newIndex = index;
    this._Column.children[0].children[this._index]._unfocus();
    this._index = index;
  }

  _updateFocus() {
    const activeHash = Router.getActiveHash();
    if (activeHash?.includes('filterPage') && activeHash?.includes('movie')) {
      this._index = getRouteNavbarIndex('filterPage/movie', this._visibleSport);
      this._setSelected(this._index);
      return;
    } else if (activeHash?.includes('filterPage') && activeHash?.includes('series')) {
      this._index = getRouteNavbarIndex('filterPage/series', this._visibleSport);
      this._setSelected(this._index);
      return;
    }
    const newIndex = getRouteNavbarIndex(Router.getActiveHash(), this._visibleSport);
    if (newIndex !== this._index) {
      this._setSelected(newIndex);
      this._index = newIndex;
    }
  }

  $decrementSidebar() {
    this._newIndex > 0 ? --this._newIndex : this._newIndex;
  }

  $incrementSidebar() {
    this._newIndex < this._sidebarLength - 1 ? ++this._newIndex : this._newIndex;
  }

  _getFocused() {
    return this._Column.items[this._newIndex];
  }
}

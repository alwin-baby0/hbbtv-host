import Lightning from '@lightningjs/sdk/src/Lightning';
import { Router, Utils } from '@lightningjs/sdk';
import { getRouteNavbarIndex } from '../../../../utils/routesIndex';
import { TRANSLATIONS, VISIBLE_SPORT_COUNTRIES } from '../../../../constants/globalConstants';
import SidebarItem from './SidebarItem';
import { t } from '../../../../Services';
import { CountryService } from '../../../../Services';
import HorizontalContainer from '../../../HorizontalContainer/HorizontalContainer';

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
          type: HorizontalContainer,
          collision: true,
          x: 300,
          h: 70,
          style: { itemSpacing: 30 },
          props: {
            disableScroll: true,
          },
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
      { id: 0, label: t(TRANSLATIONS.TR_HOME), route: 'home', icon: '' },
      { id: 1, label: t(TRANSLATIONS.TR_MOVIES), route: 'vod/movies', icon: '' },
      { id: 2, label: t(TRANSLATIONS.TR_SERIES), route: 'vod/series', icon: '' },
    ];
    this._visibleSport
      ? menuItems.push(
          ...[
            { id: 3, label: t(TRANSLATIONS.TR_SPORT), route: 'vod/sports', icon: '' },
            { id: 4, label: t(TRANSLATIONS.TR_LIVE_TV), route: 'live', icon: '' },
            { id: 5, label: 'search', route: 'search', icon: 'images/navbar/search.svg' },
            { id: 6, label: 'user', route: 'account', icon: 'images/navbar/user.svg' },
            { id: 7, label: 'settings', route: 'langsettings', icon: 'images/navbar/settings.svg' },
            { id: 8, label: 'terms', route: 'help', icon: 'images/navbar/question-mark.svg' },
          ]
        )
      : menuItems.push(
          ...[
            { id: 3, label: t(TRANSLATIONS.TR_LIVE_TV), route: 'live', icon: '' },
            { id: 4, label: 'search', route: 'search', icon: 'images/navbar/search.svg' },
            { id: 5, label: 'user', route: 'account', icon: 'images/navbar/user.svg' },
            { id: 6, label: 'settings', route: 'langsettings', icon: 'images/navbar/settings.svg' },
            { id: 7, label: 'terms', route: 'help', icon: 'images/navbar/question-mark.svg' },
          ]
        );

    this._menuItemRoutes = menuItems.map((item) => item.route);

    this._sidebarLength = menuItems.length;

    this._Column.patch({
      props: {
        items: menuItems.map((item) => {
          return {
            type: SidebarItem,
            collision: true,
            flexItem: {
              marginLeft: 5,
              marginRight: 5,
            },
            w: this._visibleSport ? (item.id < 5 ? 170 : 50) : item.id < 4 ? 170 : 50,
            h: 60,
            props: {
              selected: false,
              index: item.id,
              data: item,
              extraItemSpacing: item.route === 'live' ? 270 : 20,
            },
          };
        }),
      },
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
    this._Column.Items.children.forEach((item, i) => {
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

  _getFocused() {
    return this._Column;
  }

  _handleHover() {
    Router.focusWidget('Menu');
    this._Column._focus();
  }

  _handleUnhover() {
    Router.focusPage();
  }
}

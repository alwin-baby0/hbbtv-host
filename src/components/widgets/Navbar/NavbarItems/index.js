import Lightning from '@lightningjs/sdk/src/Lightning';
import { Router, Utils } from '@lightningjs/sdk';
import { getRouteNavbarIndex } from '../../../../utils/routesIndex';
import {
  IMG_PATH,
  ROUTES,
  TRANSLATIONS,
  VISIBLE_SPORT_COUNTRIES,
  FILTER_TYPES,
} from '../../../../constants/globalConstants';
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
          y: 10,
          src: Utils.asset(IMG_PATH.LOGO),
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

  async _updateFocus() {
    const location = await CountryService.getCountry();
    const visibleSport = VISIBLE_SPORT_COUNTRIES.includes(location.data.country.toLowerCase());
    const activeHash = Router.getActiveHash();

    if (activeHash.includes('filterPage') && activeHash.includes('movie')) {
      this._index = getRouteNavbarIndex('filterPage/movie', visibleSport);
      this._setSelected(this._index);
      return;
    } else if (activeHash.includes('filterPage') && activeHash.includes('series')) {
      this._index = getRouteNavbarIndex('filterPage/series', visibleSport);
      this._setSelected(this._index);
      return;
    }

    const newIndex = getRouteNavbarIndex(Router.getActiveHash(), visibleSport);
    if (newIndex !== this._index) {
      this._setSelected(newIndex);
      this._index = newIndex;
    }
  }

  async _active() {
    const location = await CountryService.getCountry();
    this._visibleSport = VISIBLE_SPORT_COUNTRIES.includes(location.data.country.toLowerCase());

    // setTimeout is used to give time for url hash to change before asign the right one
    setTimeout(() => {
      this._index = getRouteNavbarIndex(Router.getActiveHash(), this._visibleSport);
      this._setSelected(this._index);
    });

    const menuItems = [
      { id: 0, label: t(TRANSLATIONS.HOME), route: ROUTES.HOME, icon: '' },
      {
        id: 1,
        label: t(TRANSLATIONS.MOVIES),
        route: `${ROUTES.VOD}/${FILTER_TYPES.MOVIES}`,
        icon: '',
      },
      {
        id: 2,
        label: t(TRANSLATIONS.SERIES),
        route: `${ROUTES.VOD}/${FILTER_TYPES.SERIES}`,
        icon: '',
      },
    ];
    this._visibleSport
      ? menuItems.push(
          ...[
            {
              id: 3,
              label: t(TRANSLATIONS.SPORT),
              route: `${ROUTES.VOD}/${FILTER_TYPES.SPORTS}`,
              icon: '',
            },
            { id: 4, label: t(TRANSLATIONS.LIVE_TV), route: ROUTES.LIVE, icon: '' },
            { id: 5, label: 'search', route: ROUTES.SEARCH, icon: IMG_PATH.NAVBAR_SEARCH },
            { id: 6, label: 'user', route: ROUTES.ACC, icon: IMG_PATH.NAVBAR_USER },
            {
              id: 7,
              label: 'settings',
              route: ROUTES.SETTINGS,
              icon: IMG_PATH.NAVBAR_SETTINGS,
            },
            { id: 8, label: 'terms', route: ROUTES.HELP, icon: IMG_PATH.NAVBAR_INFO },
          ]
        )
      : menuItems.push(
          ...[
            { id: 3, label: t(TRANSLATIONS.LIVE_TV), route: ROUTES.LIVE, icon: '' },
            { id: 4, label: 'search', route: ROUTES.SEARCH, icon: IMG_PATH.NAVBAR_SEARCH },
            { id: 5, label: 'user', route: ROUTES.ACC, icon: IMG_PATH.NAVBAR_USER },
            {
              id: 6,
              label: 'settings',
              route: ROUTES.SETTINGS,
              icon: IMG_PATH.NAVBAR_SETTINGS,
            },
            { id: 7, label: 'terms', route: ROUTES.HELP, icon: IMG_PATH.NAVBAR_INFO },
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
              extraItemSpacing: item.route === ROUTES.LIVE ? (this._visibleSport ? 270 : 480) : 20,
            },
          };
        }),
      },
    });
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
    Router.focusWidget(ROUTES.MENU_WIDGET);
    this._Column._focus();
  }

  _handleUnhover() {
    Router.focusPage();
  }
}

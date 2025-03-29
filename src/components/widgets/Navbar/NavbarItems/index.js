import Lightning from '@lightningjs/sdk/src/Lightning';
import { Row } from '@lightningjs/ui-components';
import { Colors, Router, Utils } from '@lightningjs/sdk';
import { getRouteNavbarIndex } from '../../../../utils/routesIndex';
import colors from '../../../../../reskin/colors.json';
import SidebarItem from './SidebarItem';
import { parseTranslations } from '../../../../Services';
import defTR from '../../../../../public/static/translations/en.json';

const translations = parseTranslations();

const menuItems = [
  { id: 0, label: translations?.home || defTR.home, route: 'home', icon: '' },
  { id: 1, label: translations?.movies || defTR.movies, route: 'vod/movies', icon: '' },
  { id: 2, label: translations?.series || defTR.series, route: 'vod/series', icon: '' },
  { id: 3, label: translations?.sport || defTR.sport, route: 'vod/sports', icon: '' },
  { id: 4, label: translations?.live_tv || defTR.live_tv, route: 'live', icon: '' },
  { id: 5, label: 'search', route: 'search', icon: 'images/navbar/search.svg' },
  // { id: 6, label: 'settings', route: 'settings', icon: 'images/navbar/settings.svg' },
  { id: 6, label: 'user', route: 'settings', icon: 'images/navbar/user.svg' },
  { id: 7, label: 'settings', route: 'langsettings', icon: 'images/navbar/settings.svg' },
  { id: 8, label: 'terms', route: 'help', icon: 'images/navbar/question-mark.svg' },
];

export default class SidebarItems extends Lightning.Component {
  _selectedMenuItem = 0;
  _sidebarLength = menuItems.length;
  _index = 0;

  static _template() {
    return {
      NavWrapper: {
        w: 1840,
        h: 70,
        Logo: {
          // texture: Lightning.Tools.getSvgTexture(
          //   Utils.asset(`/images/navbar/nav-logo.svg`),
          //   235,
          //   70
          // ),
          w: 235,
          h: 70,
          src: Utils.asset('/images/navbar/logo.png'),
        },
        Column: {
          type: Row,
          x: 300,
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

  _active() {
    // setTimeout is used to give time for url hash to change before asign the right one
    setTimeout(() => {
      const activeHash = Router.getActiveHash();
      // Check if activeHash contains both 'filtered' and 'movies'
      if (activeHash.includes('filterPage') && activeHash.includes('movie')) {
        this._index = getRouteNavbarIndex('filterPage/movie');
        this._setSelected(this._index);
        return;
      } else if (activeHash.includes('filterPage') && activeHash.includes('series')) {
        this._index = getRouteNavbarIndex('filterPage/series');
        this._setSelected(this._index);
        return;
      } else {
        // console.log('activeHash does not contain both "filtered" and "movies"');
      }
      this._index = getRouteNavbarIndex(Router.getActiveHash());
      this._setSelected(this._index);
    });
  }

  _focus() {
    const activeHash = Router.getActiveHash();
    // Check if activeHash contains both 'filtered' and 'movies'
    if (activeHash.includes('filterPage') && activeHash.includes('movie')) {
      // console.log('activeHash contains both "filtered" and "movies"');
      this._index = getRouteNavbarIndex('filterPage/movie');
      this._setSelected(this._index);
      return;
    } else if (activeHash.includes('filterPage') && activeHash.includes('series')) {
      this._index = getRouteNavbarIndex('filterPage/series');
      this._setSelected(this._index);
      return;
    } else {
      // console.log('activeHash does not contain both "filtered" and "movies"');
    }
    let focusedId = getRouteNavbarIndex(activeHash);
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
    const route = menuItems[index].route;
    this._setSelected(index);
    this._index = index;

    if (route) {
      Router.navigate(route);
    }
  }

  _updateFocus() {
    const activeHash = Router.getActiveHash();
    if (activeHash.includes('filterPage') && activeHash.includes('movie')) {
      this._index = getRouteNavbarIndex('filterPage/movie');
      this._setSelected(this._index);
      return;
    } else if (activeHash.includes('filterPage') && activeHash.includes('series')) {
      this._index = getRouteNavbarIndex('filterPage/series');
      this._setSelected(this._index);
      return;
    } else {
      // console.log('activeHash does not contain both "filtered" and "movies"');
    }
    const newIndex = getRouteNavbarIndex(Router.getActiveHash());
    if (newIndex !== this._index) {
      this._setSelected(newIndex);
      this._index = newIndex;
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

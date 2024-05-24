import { Lightning, Router, Utils } from '@lightningjs/sdk';
import CategoryPicker from '../../components/CategoryPicker/CategoryPicker';
import { Column } from '@lightningjs/ui-components';

export default class Movies extends Lightning.Component {
  static _template() {
    return {
      Content: {
        Background: {
          w: 1920,
          h: 2080,
          src: Utils.asset('images/background.jpg'),
        },
        Categories: {
          type: CategoryPicker,
        },
      },
      Movies: {
        x: 110,
        y: 285,
        w: 1760,
        h: 795,
        clipping: true,
        Column: {
          y: 30,
          type: Column,
        },
      },
    };
  }

  get _Content() {
    return this.tag('Content');
  }

  get _Categories() {
    return this.tag('Categories');
  }

  get _CaterogyItem() {
    return this.tag('Categories.CaterogyItem');
  }

  get _Column() {
    return this.tag('Column');
  }

  _active() {
    this._setState('Categories');
  }

  static _states() {
    return [
      class Categories extends this {
        _getFocused() {
          this._Content.patch({
            y: 0,
          });

          this.tag('Movies').patch({
            y: 285,
            h: 1920,
          });

          return this._Categories;
        }

        $enter() {
          this.fireAncestors('$hideNavbar', true);
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleDown() {
          this._setState('Movies');
        }
      },

      class Movies extends this {
        _getFocused() {
          const focusedItem = this._Column;
          if (focusedItem._selectedIndex === 0) {
            this.fireAncestors('$hideNavbar', false);
            this._Content.patch({
              y: -130,
            });
            this.tag('Movies').patch({
              y: 100,
              h: 1920,
            });
            this._Column.patch({
              y: 30,
            });
          }
          if (focusedItem._selectedIndex === 1) {
            this._Content.patch({
              y: -200,
            });
            this.tag('Movies').patch({
              y: 0,
            });
            this._Column.patch({
              y: 300,
            });
          }

          return this._Column;
        }

        _handleUp() {
          this._setState('Categories');
        }
      },
    ];
  }
}

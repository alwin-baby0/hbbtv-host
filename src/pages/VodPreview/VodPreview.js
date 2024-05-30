import { Lightning, Router, Utils } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import CategoryPicker from '../../components/CategoryPicker/CategoryPicker';

export default class VodPreview extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 2080,
        src: Utils.asset('images/background.jpg'),
      },
      Content: {
        Categories: {
          type: CategoryPicker,
          props: {
            x: 110,
            y: 150,
            width: 1760,
            height: 64,
          },
        },
      },
      VodContainer: {
        x: 110,
        y: 285,
        w: 1760,
        h: 795,
        clipping: true,
        Column: {
          y: 30,
          h: 795,
          w: 1760,
          type: VerticalContainer,
        },
      },
    };
  }

  get _Content() {
    return this.tag('Content');
  }

  get _Categories() {
    return this._Content.tag('Categories');
  }

  get _Column() {
    return this.tag('VodContainer.Column');
  }

  _active() {
    if (this._getState() !== 'VodContainer') {
      this._setState('Content');
      setTimeout(() => {
        Router.focusWidget('menu');
        Router.focusPage();
      }, 1);
    } else {
      this._setState('VodContainer');
    }
  }

  _getFocused() {
    return this._setState('Content');
  }

  _handleBack() {
    if (!Router.isNavigating()) {
      this._Column.patch({
        props: {
          items: [],
        },
      });
      this._Categories._CaterogyItems.patch({
        props: {
          items: [],
        },
      });
      this._setState('Content');
      Router.back();
    }
  }

  static _states() {
    return [
      class Content extends this {
        _getFocused() {
          return this._Categories;
        }

        $enter() {
          // console.log('entering Content state');
          this._Content.patch({
            y: 0,
          });

          this.tag('VodContainer').patch({
            y: 285,
            h: 1920,
          });
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleDown() {
          this._setState('VodContainer');
        }
      },

      class VodContainer extends this {
        _extended = true;

        $enter() {
          this.fireAncestors('$hideNavbar', false);
          this._extended = this._Column._focusedIndex > 0;
          this._extended = false;
          this._Content.patch({
            y: -130,
          });
          this.tag('VodContainer').patch({
            y: 100,
            h: 1920,
          });
        }

        correctContainerSize() {
          if (this._Column._focusedIndex === 0 && this._extended === true) {
            this._extended = false;
            this._Content.patch({
              y: -130,
            });
            this.tag('VodContainer').patch({
              y: 100,
              h: 1080,
            });
            this._Column.patch({
              h: 795,
            });
          }
          if (this._Column._focusedIndex >= 1 && this._extended === false) {
            this._extended = true;
            this.tag('VodContainer').patch({
              y: 0,
            });
            this._Content.patch({
              y: -200,
            });
            this._Column.patch({
              h: 1040,
            });
          }
        }

        $exit() {
          // console.log('exit VodContainer state');
          this.fireAncestors('$hideNavbar', true);
        }

        _getFocused() {
          this.fireAncestors('$hideNavbar', false);
          return this._Column;
        }

        _handleUp() {
          this.correctContainerSize();
          this._setState('Content');
          return false;
        }

        $verticalContainerIndexChange(index) {
          this.correctContainerSize();
        }
      },
    ];
  }
}

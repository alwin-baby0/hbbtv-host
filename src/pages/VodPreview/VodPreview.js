import { Lightning, Router, Utils } from '@lightningjs/sdk';
import CategoryPicker from '../../components/CategoryPicker/CategoryPicker';
import { Column } from '@lightningjs/ui-components';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';

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
            width: 1700,
            height: 64,
          }
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

  _firstActive() {
    this._setState('Content');
  }

  _active() {
    if (this._getState() === 'VodContainer') {
      console.log('VodContainer _active')
      this.fireAncestors('$hideNavbar', true);
      this.fireAncestors('$hideNavbar', false);
      Router.focusPage()
    }
  }

  _handleDown() {
    console.log('parent down')
  }

  static _states() {
    return [
      class Content extends this {
        _getFocused() {
          return this._Categories;
        }

        $enter() {
          console.log('entering Content state')
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
          this.correctContainerSize();
        }

        correctContainerSize() {
          if (this._Column._focusedIndex === 0 && this._extended === true) {
            this._extended = false;
            this._Content.patch({
              y: -130,
            });
            this.tag('VodContainer').patch({
              y: 100,
              h: 1920,
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
          }
        }

        $exit() {
          console.log('exit VodContainer state')
          this.fireAncestors('$hideNavbar', true);
        }

        _getFocused() {
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

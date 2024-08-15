import { Lightning, Router, Utils } from '@lightningjs/sdk';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import Button from './components/Button';
import { CONTENT_TYPE } from '../../Components/VodContentContainer/VodContentContainer';

export default class Filtered extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 2080,
        src: Utils.asset('images/background.jpg'),
      },
      GenresInfo: {
        x: 100,
        y: 150,
        w: 380,
        h: 70,
        flex: { direction: 'row', alignItems: 'center' },
        BackButton: {
          type: Button,
        },
        ArrowImage: {
          x: 30,
          texture: Lightning.Tools.getSvgTexture(Utils.asset('icons/arrowRight.svg'), 10, 16),
        },
        Genre: {
          x: 60,
          y: 3,
          text: {
            fontSize: 20,
            fontStyle: 'normal bold',
          },
        },
      },

      Wrapper: {
        x: 80,
        y: 80,
        h: 1080,
        w: 1760,
        clipping: true,
        Title: {
          x: 20,
          w: 300,
          h: 100,
        },
        Column: {
          y: 170,
          // h: 795,
          h: 1080,
          w: 1760,
          // y: 100,
          type: VerticalContainer,
        },
      },
    };
  }

  get _VodContainer() {
    return this.tag('Wrapper');
  }

  get _VodContentContainer() {
    return this.tag('GenresInfo.BackButton');
  }

  get _Column() {
    return this.tag('Column');
  }

  get _Title() {
    return this.tag('Title');
  }

  get _Button() {
    return this.tag('GenresInfo.BackButton');
  }

  get _Genre() {
    return this.tag('GenresInfo.Genre');
  }

  _enable() {
    this.fireAncestors('$setNavbarVisibility', true);
  }

  _active() {
    if (this._Column.Items.children.length == 0) {
      this._setState('Button');
    } else {
      this._setState('VodContainer');
      this._VodContentContainer.patch({
        y: 0,
      });
    }
  }

  calculateContentOffset(contentType) {
    switch (contentType) {
      case CONTENT_TYPE.EVENTS:
        return 530;
      case CONTENT_TYPE.CATEGORIES:
        return 200;
      case CONTENT_TYPE.EMPTY:
      default:
        return 80;
    }
  }

  static _states() {
    return [
      class VodContentContainer extends this {
        _active() {
          this._VodContainer.patch({
            y: this.calculateContentOffset(this._VodContentContainer.contentType),
            h: 1920,
          });
        }

        $enter() {
          this._Column.patch({
            y: 170,
          });
          this.fireAncestors('$setNavbarVisibility', true);

          if (this._VodContentContainer.contentType === CONTENT_TYPE.EMPTY) {
            this._setState('VodContainer');
          }

          this._VodContentContainer.patch({
            y: 0,
          });

          this._VodContainer.patch({
            y: this.calculateContentOffset(this._VodContentContainer.contentType),
            h: 1920,
          });
        }

        _enable() {
          this.fireAncestors('$setNavbarVisibility', true);
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleDown() {
          if (this._Column.Items.children.length > 0) {
            this._setState('VodContainer');
          } else {
            return false;
          }
        }

        _getFocused() {
          return this._VodContentContainer;
        }
      },
      class Column extends this {
        _handleUp() {
          this._setState('Button');
        }
      },

      class Button extends this {
        _handleUp() {
          Router.focusWidget('Menu');
          return;
        }
        _getFocused() {
          return this._Button;
        }
        _handleDown() {
          if (this._Column.Items.children.length == 0) {
            this._setState('Button');
          } else {
            this._setState('Column');
          }
        }
      },
      class VodContainer extends this {
        $enter() {
          this.correctContainerSize();

          this._VodContainer.patch({
            y: this.calculateContentOffset(this._VodContentContainer.contentType),
            h: 1080,
          });
        }

        correctContainerSize() {
          if (this._Column._focusedIndex === 0) {
            this._VodContentContainer.patch({
              y: 0,
            });
            this._Column.patch({
              y: 170,
            });

            this._VodContainer.patch({
              y: this.calculateContentOffset(this._VodContentContainer.contentType),
              h: 1920,
            });
            this.tag('GenresInfo').visible = true;
            this.fireAncestors('$setNavbarVisibility', true);
          }
          if (this._Column._focusedIndex === 1) {
            this._Column.patch({
              y: 0,
            });
            this.fireAncestors('$setNavbarVisibility', false);
            this._VodContainer.patch({
              y: 0,
              h: 1080,
            });
            this.tag('GenresInfo').visible = false;
          }
          if (this._Column._focusedIndex > 1) {
            this.tag('GenresInfo').visible = false;

            this._VodContainer.patch({
              y: 0,
              h: 1080,
            });
            this._VodContentContainer.patch({
              y: -700,
            });

            this.fireAncestors('$setNavbarVisibility', false);
          }
        }

        _enable() {
          this.correctContainerSize();
        }

        _getFocused() {
          return this._Column;
        }

        _handleUp() {
          if (this._VodContentContainer.contentType === CONTENT_TYPE.EMPTY) {
            Router.focusWidget('Menu');
          } else {
            this._setState('VodContentContainer');
          }
        }

        async $verticalContainerIndexChange(index) {
          this.correctContainerSize();
        }
      },
    ];
  }
}

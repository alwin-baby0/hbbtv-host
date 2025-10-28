import { Lightning, Router, Utils } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import Button from './components/Button';
import { CONTENT_TYPE } from '../../components/VodContentContainer/VodContentContainer';
import { IMG_PATH, ROUTES } from '../../constants/globalConstants';

export default class Filtered extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 2080,
        src: Utils.asset(IMG_PATH.BACKGROUND),
      },
      GenresInfo: {
        collision: true,
        x: 100,
        y: 150,
        w: 380,
        h: 70,
        flex: { direction: 'row', alignItems: 'center' },
        BackButton: {
          collision: true,
          type: Button,
        },
        ArrowImage: {
          x: 30,
          texture: Lightning.Tools.getSvgTexture(Utils.asset(IMG_PATH.RIGHT_ARROW), 10, 16),
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
          h: 1080,
          w: 1760,
          collision: true,
          type: VerticalContainer,
          props: {
            parentState: 'VodContainer',
          },
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

  get _Genre() {
    return this.tag('GenresInfo.Genre');
  }

  get _GenresInfo() {
    return this.tag('GenresInfo');
  }

  _enable() {
    this.fireAncestors('$setNavbarVisibility', true);
  }

  _active() {
    if (this._Column.Items.children.length == 0) {
      this._setState('VodContentContainer');
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
      default:
        return 80;
    }
  }

  $updateFilteredVerticalState(nextState) {
    this._setState(nextState);
  }

  $handleStateHover(index, stateName = null) {
    if (stateName) {
      this._setState(stateName);
      return;
    }
    this._setState(states[index]);
    this.children[index]._unfocus();
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
          this.patch({
            GenresInfo: {
              BackButton: {
                y: 0,
              },
            },
            Wrapper: {
              y: this.calculateContentOffset(this._VodContentContainer.contentType),
              h: 1920,
              Column: {
                y: 170,
              },
            },
          });
          this.fireAncestors('$setNavbarVisibility', true);

          if (this._VodContentContainer.contentType === CONTENT_TYPE.EMPTY) {
            this._setState('VodContainer');
          }
        }

        _enable() {
          this.fireAncestors('$setNavbarVisibility', true);
        }

        _handleUp() {
          Router.focusWidget(ROUTES.MENU_WIDGET);
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
            this.patch({
              GenresInfo: {
                BackButton: {
                  y: 0,
                },
              },
              Wrapper: {
                y: this.calculateContentOffset(this._VodContentContainer.contentType),
                h: 1920,
                Column: {
                  y: 170,
                },
              },
            });
            this._GenresInfo.visible = true;
            this.fireAncestors('$setNavbarVisibility', true);
          }
          if (this._Column._focusedIndex === 1) {
            this.patch({
              Wrapper: {
                y: 0,
                h: 1080,
                Column: {
                  y: 0,
                },
              },
            });
            this.fireAncestors('$setNavbarVisibility', false);
            this._GenresInfo.visible = false;
          }
          if (this._Column._focusedIndex > 1) {
            this._GenresInfo.visible = false;

            this.patch({
              GenresInfo: {
                BackButton: {
                  y: -700,
                },
              },
              Wrapper: {
                y: 0,
                h: 1080,
              },
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
            Router.focusWidget(ROUTES.MENU_WIDGET);
          } else {
            this._setState('VodContentContainer');
          }
        }

        async $verticalContainerIndexChange() {
          this.correctContainerSize();
        }
      },
    ];
  }
}

import { Lightning, Router, Utils } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import CategoryPicker from '../../components/CategoryPicker/CategoryPicker';

export default class VodPreview extends Lightning.Component {
  _props = {
    focusedState: 'Content',
    ancestorIndex: 0,
  };
  static _template() {
    return {
      collision: true,
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
        LiveEvents: {
          collision: true,
          x: 110,
          y: 200,
          h: 500,
          w: 1920,
          type: VerticalContainer,
        },
      },
      VodContainer: {
        x: 110,
        y: 670,
        w: 1760,
        h: 670,
        clipping: true,
        Column: {
          y: 50,
          h: 795,
          w: 1760,
          type: VerticalContainer,
        },
      },
    };
  }

  get _VodContainer() {
    return this.tag('VodContainer');
  }

  get _LiveEvents() {
    return this.tag('LiveEvents');
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

  set props(props) {
    this._props = { ...this._props, ...props };
    const { focusedState } = this._props;
    if (this._getState() !== 'VodContainer') {
      if (focusedState === 'Events') {
        if (this._LiveEvents.Items.children.length > 0) {
          this._setState('Events');
        } else {
          this._setState('VodContainer');
        }
      } else if (focusedState === 'Content') {
        this._setState('Content');
      }
    } else {
      this._setState('VodContainer');
    }
  }

  _getFocused() {
    return this._setState('Content');
  }

  _handleClick() {}

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
          this._Content.patch({
            y: 0,
          });

          this._VodContainer.patch({
            y: 200,
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

      class Events extends this {
        _getFocused() {
          return this._LiveEvents;
        }

        $enter() {
          this.$verticalContainerIndexChange();

          this._Content.patch({
            y: 0,
          });

          this._VodContainer.patch({
            h: 1920,
          });
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleDown() {
          this._setState('VodContainer');
        }

        $verticalContainerIndexChange(index) {
          const currentIndex = index;
          currentIndex == undefined ? this._props.ancestorIndex : index;
          this._props.ancestorIndex = index !== undefined ? index : this._props.ancestorIndex;
          if (this._props.ancestorIndex === 0) {
            this.fireAncestors('$hideNavbar', true);
          } else {
            this.fireAncestors('$hideNavbar', false);
          }
          if (this._LiveEvents.Items.children.length > 1) {
            if (this._props.ancestorIndex === this._LiveEvents.Items.children.length - 1) {
              this._VodContainer.patch({
                y: 670,
              });
            } else {
              this._VodContainer.patch({
                y: 1080,
              });
            }
            this._LiveEvents.patch({
              y: 200,
            });
          } else {
            this._LiveEvents.patch({
              y: 200,
            });
            this._VodContainer.patch({
              y: 670,
            });
          }

          this.correctContainerSize();
        }
      },

      class VodContainer extends this {
        _extended = true;

        $enter() {
          this._extended = this._Column._focusedIndex > 0;
          this._extended = false;
          this.correctContainerSize();
          if (this._LiveEvents.Items.children.length > 0) {
            if (this._props.focusedState === 'Events') {
              this.fireAncestors('$hideNavbar', false);
              this._Content.patch({
                y: -450,
              });
              this._VodContainer.patch({
                y: 200,
                h: 1080,
              });
            }
          } else {
            this._VodContainer.patch({
              y: 200,
              h: 1080,
            });
          }
        }

        correctContainerSize() {
          if (this._Column._focusedIndex === 0 && this._extended === true) {
            this.fireAncestors('$hideNavbar', false);
            this._extended = false;

            if (this._props.focusedState === 'Events') {
              this._Content.patch({
                y: -450,
              });
            } else {
              this.fireAncestors('$hideNavbar', true);
              this._Content.patch({
                y: 0,
              });
            }
            this._VodContainer.patch({
              y: 200,
              h: 1080,
            });
            this._Column.patch({
              h: 795,
            });
          }
          if (this._Column._focusedIndex >= 1 && this._extended === false) {
            this.fireAncestors('$hideNavbar', false);
            this._extended = true;
            this._VodContainer.patch({
              y: 0,
            });
            this._Content.patch({
              y: -700,
            });
            this._Column.patch({
              h: 1040,
            });
          }
        }

        $exit() {
          this.fireAncestors('$hideNavbar', true);
        }

        _getFocused() {
          return this._Column;
        }

        _handleUp() {
          if (this._Categories.visible) {
            this._setState('Content');
          } else if (this._LiveEvents.Items.children.length > 0) {
            this._setState('Events');
          } else {
            Router.focusWidget('Menu');
          }
        }

        $verticalContainerIndexChange(index) {
          this.correctContainerSize();
        }
      },
    ];
  }
}

import { Colors, Lightning, Router } from '@lightningjs/sdk';
import KeyboardSearch from '../../Components/Keyboard/components/KeyboardSearch';
import InputField from './components/Input';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import { getSearch } from '../../api/search';
import { constructRails } from '../utils';
import { HomePageService } from '../../Services/HomePageService';
const sports = {
  items: [],
  timestamp: 0,
};

export default class Search extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      InputWrapper: {
        x: 110,
        y: 150,
        w: 1700,
        Input: {
          type: InputField,
        },
      },
      Wrapper: {
        w: 1920,
        h: 1080,
        flex: { direction: 'row', justifyContent: 'center' },
        Keyboard: {
          type: KeyboardSearch,
          zIndex: 205,
          visible: false,
          limit: 50,
        },
      },
      VODWrapper: {
        x: 80,
        y: 281,
        w: 1760,
        h: 1080,
        clipping: true,
        VODSection: {
          x: 20,
          y: 20,
          w: 1760,
          h: 1080,
          type: VerticalContainer,
          plinko: true,
          lazyUpCount: 2,
          lazyUpCountBuffer: 2,
        },
      },
    };
  }

  get _VODSection() {
    return this.tag('VODSection');
  }

  get _Content() {
    return this.tag('InputWrapper');
  }

  $onSoftKey({ key }) {
    this._Input.tag('Input').listening = true;

    const inputTag = this._Input.tag('Input');
    if (inputTag.listening) {
      if (key === 'Space') {
        inputTag.insert(' ');
      } else if (key === 'Delete') {
        inputTag.backspace();
      } else if (key === 'Clear') {
        inputTag.clear();
      } else if (key === 'backspace') {
        inputTag.backspace();
      } else if (key === 'Done') {
        this._Keyboard.visible = false;
        this._setState('Input');
      } else {
        inputTag.insert(key);
      }
    }
    this._Input._changePlaceholder();
    this.$updatedVOD();
  }

  async $updatedVOD(keyword, category) {
    let inputValue = this._Input.tag('Input').value.toLowerCase();

    if (inputValue.length > 2) {
      getSearch(inputValue, '').then((data) => {
        if (data?.items) {
          data.items && this.$changedVODGenre(data);
        }
      });
    } else {
      await HomePageService.initialFetch();
      this.$changedVODGenre(HomePageService.stripes[0]);
    }
  }

  async $changedVODGenre(data) {
    sports.items = constructRails(data);

    sports.timestamp = new Date().getTime();

    this.tag('VODSection').props = {
      items: sports.items,
    };
  }

  _enable() {
    this._setState('Input');
    this.$updatedVOD();
  }

  get _Input() {
    return this.tag('Input');
  }

  $getInput() {
    return this._Input.tag('Input');
  }

  $setFocusKeyboard() {
    this._setState('Keyboard');
  }

  get _Keyboard() {
    return this.tag('Keyboard');
  }

  static _states() {
    return [
      class Input extends this {
        _getFocused() {
          return this._Input;
        }

        _focus() {
          this._Input.tag('InputWrapper').patch({
            color: Colors('#1D1F2E').get(),
          });
          this._Input.tag('InputWrapper').patch({
            texture: Lightning.Tools.getRoundRect(
              1700,
              110,
              10,
              1,
              Colors('#1D1F2E').get(),
              Colors('#1D1F2E').get()
            ),
          });
        }

        _unfocus() {
          this._Input.tag('InputWrapper').patch({
            color: Colors('#1e1e1e').get(),
          });

          this._Input.tag('InputWrapper').patch({
            color: Colors('#383942').get(),
            w: 1700,
            h: 110,
            texture: Lightning.Tools.getRoundRect(1700, 110, 10, 1, Colors('#fff').get(), false),
          });
        }

        _handleUp() {
          Router.focusWidget('menu');
        }

        _handleDown() {
          if (this._VODSection.Items.children.length > 0) {
            this._Input.tag('Input').listening = false;
            this._setState('VODSection');
          } else {
            return false;
          }
        }

        _handleClick() {
          this._handleEnter();
        }

        _handleEnter() {
          this._Keyboard.visible = true;
          this._setState('Keyboard');
          this._Input.tag('Input').listening = true;
        }

        $enter() {
          this._Content.patch({
            y: 150,
          });

          this.tag('VODWrapper').patch({
            y: 281,
            h: 1920,
          });
        }
      },

      class VODSection extends this {
        _extended = true;

        _handleUp() {
          this._setState('Input');
        }

        _getFocused() {
          return this.tag('VODSection');
        }

        $enter() {
          this.fireAncestors('$setNavbarVisibility', false);
          this._extended = this._VODSection._focusedIndex > 0;
          this._extended = false;
          this._Content.patch({
            y: -550,
          });
          this.tag('VODWrapper').patch({
            y: 0,
            h: 1920,
          });
        }

        $exit() {
          this.fireAncestors('$setNavbarVisibility', true);
        }

        correctContainerSize() {
          if (this._VODSection._focusedIndex === 0 && this._extended === true) {
            this._extended = false;
            this._Content.patch({
              y: -100,
            });
            this.tag('VODWrapper').patch({
              y: 0,
              h: 1080,
            });
            this._VODSection.patch({
              h: 795,
            });
          }
          if (this._VODSection._focusedIndex >= 1 && this._extended === false) {
            this._extended = true;
            this.tag('VODWrapper').patch({
              y: 0,
            });
            this._Content.patch({
              y: -200,
            });
            this._VODSection.patch({
              h: 1040,
            });
          }
        }

        $verticalContainerIndexChange(index) {
          this.correctContainerSize();
        }
      },

      class Keyboard extends this {
        _getFocused() {
          return this._Keyboard;
        }

        _handleBack() {
          this._Keyboard.visible = false;
          this._setState('Input');
        }

        _handleUp() {
          this._setState('Input');
          this._Keyboard.visible = false;
        }

        _handleLeft() {
          return true;
        }
      },
    ];
  }
}

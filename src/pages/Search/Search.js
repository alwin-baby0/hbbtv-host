import { Colors, Lightning, Router } from '@lightningjs/sdk';
import KeyboardSearch from '../../components/Keyboard/components/KeyboardSearch';
import InputField from '../../components/Input/Input';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import { constructRails } from '../utils';
import { HomePageService, SearchService, t } from '../../Services';
import { eventTrackPayload } from '../../utils/device';
import LoadingScreenComponent from '../../components/LoadingScreenComponent/LoadinScreenComponent';
import {
  CARD_TYPES,
  EVENT_NAMES,
  ROUTES,
  RAIL_TYPES,
  TRANSLATIONS,
} from '../../constants/globalConstants';

const search = {
  items: [],
  timestamp: 0,
};

const states = ['Input', 'VODSection', 'Keyboard'];

export default class Search extends Lightning.Component {
  searchTimeout;
  numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

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
          props: {
            parentState: 'Input',
          },
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
          props: {
            parentState: 'Keyboard',
          },
        },
      },
      VODWrapper: {
        x: 80,
        y: 281,
        w: 1760,
        h: 1080,
        clipping: true,
        visible: true,
        VODSection: {
          x: 20,
          y: 20,
          w: 1760,
          h: 1080,
          type: VerticalContainer,
          collision: true,
          plinko: true,
          props: {
            parentState: 'VODSection',
          },
        },
      },
      Spinner: {
        x: 960,
        y: 540,
        visible: false,
        type: LoadingScreenComponent,
      },
    };
  }

  get _VodWrapper() {
    return this.tag('VODWrapper');
  }

  get _VODSection() {
    return this.tag('VODSection');
  }

  get _Content() {
    return this.tag('InputWrapper');
  }

  get _Spinner() {
    return this.tag('Spinner');
  }

  get _Input() {
    return this.tag('Input');
  }

  get _Keyboard() {
    return this.tag('Keyboard');
  }

  _handleKey(key) {
    if (this.numberKeys.includes(key.key)) {
      this.$onSoftKey(key);
    }
  }

  $onSoftKey({ key }) {
    this._Input._Input.listening = true;

    const inputTag = this._Input._Input;
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
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.$updatedVOD();
    }, 1000);
  }

  _inactive() {
    this._Input._Input.listening = false;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  async $updatedVOD() {
    let inputValue = this._Input._Input.value.toLowerCase();

    this.patch({
      VODWrapper: {
        visible: false,
      },
      Spinner: {
        visible: true,
      },
    });

    if (inputValue.length > 2) {
      SearchService.getSearch(inputValue, '').then((data) => {
        if (data?.items) {
          data.items && this.$changedVODGenre(data);
        }
      });

      eventTrackPayload(EVENT_NAMES.SEARCH, inputValue);
    } else {
      await HomePageService.initialFetch();
      this.$changedVODGenre(HomePageService.stripes[0]);
    }
  }

  async $changedVODGenre(data) {
    const rows = [];
    for (let i = 0, j = data.items.length; i < j; i += 6) {
      rows.push({
        items: data.items.slice(i, i + 6),
        railTitle: i === 0 ? data.railTitle : '',
        cardType: CARD_TYPES.POSTER,
        railType: RAIL_TYPES.SEARCH,
      });
    }

    if (rows.length > 0) {
      search.timestamp = new Date().getTime();

      search.items = constructRails(rows);

      this._VODSection.patch({
        props: {
          items: search.items,
        },
        text: {
          text: '',
        },
      });
    } else {
      this._VODSection.patch({
        text: {
          text: t(TRANSLATIONS.NO_RESULTS) || 'No matches found',
        },
        props: {
          items: [],
        },
      });
    }

    this.patch({
      VODWrapper: {
        visible: true,
      },
      Spinner: {
        visible: false,
      },
    });
  }

  _firstEnable() {
    this._setState('Input');
    this.$updatedVOD();
  }

  $getInput() {
    return this._Input._Input;
  }

  $setFocusKeyboard() {
    this._setState('Keyboard');
  }

  _active() {
    this.fireAncestors('$unpunchHole');
  }

  _handleHover() {
    Router.focusPage();
  }

  _handleBack() {
    Router.setHistory([{ hash: ROUTES.HOME, state: null }]);
    Router.back();
  }

  $handleStateHover(index, stateName = null) {
    if (stateName) {
      this._setState(stateName);
      return;
    }
    this._setState(states[index]);
  }

  static _states() {
    return [
      class Input extends this {
        _getFocused() {
          return this._Input;
        }

        _focus() {
          this._Input._InputWrapper.patch({
            color: Colors('#1D1F2E').get(),
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
          this._Input._InputWrapper.patch({
            color: Colors('#383942').get(),
            w: 1700,
            h: 110,
            texture: Lightning.Tools.getRoundRect(1700, 110, 10, 1, Colors('#fff').get(), false),
          });
        }

        _handleUp() {
          Router.focusWidget(ROUTES.MENU_WIDGET);
        }

        _handleDown() {
          if (this._VODSection.Items.children.length > 0 && this._VodWrapper.visible) {
            this._Input._Input.listening = false;
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
          this._Input._Input.listening = true;
        }

        $enter() {
          this.patch({
            InputWrapper: {
              y: 150,
            },
            VODWrapper: {
              y: 281,
              h: 1920,
            },
          });
        }
      },

      class VODSection extends this {
        _extended = true;

        _handleUp() {
          this._setState('Input');
        }

        _getFocused() {
          return this._VODSection;
        }

        $enter() {
          this.fireAncestors('$setNavbarVisibility', false);
          this._extended = this._VODSection._focusedIndex > 0;
          this.patch({
            InputWrapper: {
              y: 20,
            },
            VODWrapper: {
              y: 120,
              h: 1920,
            },
          });
        }

        $exit() {
          this.fireAncestors('$setNavbarVisibility', true);
        }

        correctContainerSize() {
          if (this._VODSection._focusedIndex === 0 && this._extended === true) {
            this._extended = false;
            this.patch({
              InputWrapper: {
                y: 20,
              },
              VODWrapper: {
                y: 120,
                h: 1080,
              },
              VODSection: {
                h: 795,
              },
            });
          }
          if (this._VODSection._focusedIndex >= 1 && this._extended === false) {
            this._extended = true;
            this.patch({
              InputWrapper: {
                y: -200,
              },
              VODWrapper: {
                y: 0,
              },
              VODSection: {
                h: 1040,
              },
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

        _handleBack(e) {
          e.preventDefault();
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

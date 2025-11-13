import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
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
  LOCAL_STORAGE_KEYS,
  IMG_PATH,
} from '../../constants/globalConstants';
import QueryButton from '../../components/Buttons/QueryButton/QueryButton';

const search = {
  items: [],
  timestamp: 0,
};

const states = ['Input', 'VODSection', 'Keyboard', 'Queries'];

export default class Search extends Lightning.Component {
  searchTimeout;
  numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  searchTerms = [];

  static _template() {
    return {
      w: 1920,
      h: 1080,
      Background: {
        src: Utils.asset(IMG_PATH.BACKGROUND_SEARCH_PAGE),
        zIndex: 1,
      },
      Overlay: {
        src: Utils.asset(IMG_PATH.GRADIENT_SVG),
        zIndex: 2,
      },
      SearchLabel: {
        zIndex: 3,
        w: 420,
        h: 80,
        x: 100,
        y: 160,
        text: {
          text: 'Search',
          fontFace: 'Montserrat-Bold',
          fontSize: 50,
        },
      },
      InputWrapper: {
        zIndex: 3,
        x: 610,
        y: 250,
        w: 200,
        Input: {
          type: InputField,
          props: {
            parentState: 'Input',
          },
        },
        visible: false,
      },
      Wrapper: {
        zIndex: 3,
        w: 500,
        h: 500,
        x: 100,
        y: 260,
        flex: { direction: 'row', justifyContent: 'center' },
        Keyboard: {
          type: KeyboardSearch,
          zIndex: 25,
          visible: true,
          limit: 50,
          props: {
            parentState: 'Keyboard',
          },
        },
      },
      VODWrapper: {
        zIndex: 3,
        x: 600,
        y: 160,
        w: 1760,
        h: 1080,
        clipping: true,
        visible: true,
        VODSection: {
          x: 20,
          y: 0,
          w: 1760,
          h: 1080,
          type: VerticalContainer,
          collision: true,
          plinko: true,
          props: {
            parentState: 'VODSection',
            enableScroll: false,
          },
        },
      },
      Spinner: {
        x: 960,
        y: 540,
        visible: false,
        type: LoadingScreenComponent,
      },
      SearchQueries: {
        zIndex: 3,
        w: 420,
        h: 320,
        y: 700,
        x: 100,
        flex: { direction: 'column' },
        Title: {
          w: 350,
          h: 40,
          y: 80,
          text: {
            text: 'No recent searches',
            fontSize: 35,
          },
        },
        Queries: {
          y: 85,
          w: 350,
          h: 300,
          flex: { direction: 'column' },
          type: VerticalContainer,
          collision: true,
          props: {
            parentState: 'Queries',
          },
        },
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

  get _SearchLabel() {
    return this.tag('SearchLabel');
  }

  get _SearchQueries() {
    return this.tag('SearchQueries');
  }

  get _Queries() {
    return this.tag('Queries');
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
      } else if (key === 'backspace') {
        inputTag.backspace();
      } else if (key === 'CLEAR') {
        inputTag.clear();
      } else {
        inputTag.insert(key);
      }
    }

    let inputValue = inputTag.value.toLowerCase();

    this.patch({
      SearchLabel: {
        text: {
          text: (inputValue && inputValue) || 'Search',
        },
      },
    });
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
    this.patch({
      SearchLabel: {
        text: {
          text: 'Search',
        },
      },
    });
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  $searchRecent(term) {
    const inputTag = this._Input._Input;
    inputTag.value = term;
    inputTag.position = term.length;
    const inputValue = inputTag.value.toLowerCase();

    this.patch({
      SearchLabel: {
        text: {
          text: (inputValue && inputValue) || 'Search',
        },
      },
    });

    this.$updatedVOD();
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
    for (let i = 0, j = data.items.length; i < j; i += 4) {
      rows.push({
        items: data.items.slice(i, i + 4),
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
          enableScroll: rows.length > 2,
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
    this._setState('Keyboard');
  }

  $getInput() {
    return this._Input._Input;
  }

  $setFocusKeyboard() {
    this._setState('Keyboard');
  }

  _active() {
    this.fireAncestors('$unpunchHole');
    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.RECENT_SEARCH))
      localStorage.setItem(LOCAL_STORAGE_KEYS.RECENT_SEARCH, JSON.stringify(this.searchTerms));

    const localSearchs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.RECENT_SEARCH));

    if (localSearchs && localSearchs.length > 0) {
      const items = localSearchs.map((term) => ({
        type: QueryButton,
        title: term,
        w: 250,
        h: 65,
      }));

      if (localSearchs && localSearchs.length > 0) {
        this.patch({
          SearchQueries: {
            Title: {
              visible: false,
            },
            Queries: {
              props: {
                items: items,
                enableScroll: false,
              },
            },
          },
        });
      }
    }
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
      class VODSection extends this {
        _extended = true;

        _handleUp() {
          Router.focusWidget('menu');
        }

        _handleLeft() {
          this._setState('Keyboard');
        }

        _getFocused() {
          return this._VODSection;
        }

        $enter() {
          const localSearchs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.RECENT_SEARCH));

          let inputValue = this._Input._Input.value.toLowerCase();
          if (
            inputValue.length > 2 &&
            !localSearchs.includes(inputValue) &&
            localSearchs.length < 4
          ) {
            localSearchs.unshift(inputValue);
            const items = localSearchs.map((term) => ({
              type: QueryButton,
              title: term,
              w: 250,
              h: 65,
            }));
            this.patch({
              SearchQueries: {
                Title: {
                  visible: false,
                },
                Queries: {
                  props: {
                    items: items,
                    enableScroll: false,
                  },
                },
              },
            });
          }

          localStorage.setItem(LOCAL_STORAGE_KEYS.RECENT_SEARCH, JSON.stringify(localSearchs));

          this._extended = this._VODSection._focusedIndex > 0;
          this.patch({
            VODWrapper: {
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
              VODWrapper: {
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
          this._setState('Input');
        }

        _handleUp() {
          Router.focusWidget('menu');
        }

        _handleLeft() {
          return true;
        }

        _handleRight() {
          if (this._VODSection.Items.children.length > 0 && this._VodWrapper.visible) {
            this._setState('VODSection');
          } else {
            return false;
          }
        }

        _handleDown() {
          this._setState('Queries');
        }
      },

      class Queries extends this {
        _getFocused() {
          return this._Queries;
        }

        _handleUp() {
          this._setState('Keyboard');
        }
      },
    ];
  }
}

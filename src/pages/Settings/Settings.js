import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import LanguageButton from '../../components/Buttons/LanguageButton/LanguageButton';
// import { CMPService } from '../../Services';
import { ROUTES, TRANSLATIONS, IMG_PATH } from '../../constants/globalConstants';
import HorizontalContainer from '../../components/HorizontalContainer/HorizontalContainer';
import Button from '../../components/Button/Button';
import { didomiVisible } from '../../App';
import { t } from '../../utils';

export default class Settings extends Lightning.Component {
  static _template() {
    return {
      Background: {
        src: Utils.asset(IMG_PATH.BACKGROUND_SUPPORT_PAGES),
        y: 0,
        x: 350,
        w: 1570,
        h: 883,
        zIndex: 1,
      },
      Overlay: {
        src: Utils.asset(IMG_PATH.GRADIENT_SVG),
        zIndex: 2,
      },
      Content: {
        w: 1310,
        h: 920,
        x: 80,
        y: 150,
        zIndex: 3,
        LanguagesContainer: {
          Title: {
            text: {
              text: t(TRANSLATIONS.LANGUAGES),
              fontFace: 'Montserrat-Bold',
            },
          },
          Divider: {
            y: 20,
            x: 550,
            h: 4,
            w: 1210,
            rect: true,
            color: Colors('#ffffff').alpha(0.5).get(),
          },
          LanguagesRowContainer: {
            type: HorizontalContainer,
            y: 50,
            x: 550,
            collision: true,
            h: 300,
            w: 1050,
          },
        },
        CMPContainer: {
          y: 350,
          Title: {
            text: {
              text: t(TRANSLATIONS.COOKIE_PREFERENCES),
              fontFace: 'Montserrat-Bold',
            },
          },
          CMPData: {
            x: 550,
            w: 1210,
            h: 920,
            Divider: {
              h: 4,
              w: 1210,
              rect: true,
              color: Colors('#ffffff').alpha(0.5).get(),
              flexItem: {
                marginTop: 30,
                marginBottom: 30,
              },
            },
          },
        },
      },
      Version: {
        x: 100,
        y: 980,
        w: 230,
        h: 100,
        zIndex: 3,
        Text: {
          w: 230,
          h: 35,
          text: {
            text: 'VERSION: ' + process.env.APP_VERSION,
            textAlign: 'center',
            fontFace: 'Montserrat-Medium',
            fontSize: 30,
            lineHeight: 35,
            letterSpacing: 1.2,
            wordWrap: false,
            textOverflow: 'ellipsis',
          },
        },
      },
    };
  }

  get _Version() {
    return this.tag('Version');
  }

  get _LanguagesRowContainer() {
    return this.tag('Content.LanguagesContainer.LanguagesRowContainer');
  }

  get _Content() {
    return this.tag('Content');
  }

  _arrangeLngBtns(languages) {
    const itemsPerCol = 4;
    const cols = [];

    const langArray = Object.entries(languages).map(([key, value]) => ({
      key,
      value,
    }));

    for (let i = 0; i < langArray.length; i += itemsPerCol) {
      cols.push({ items: langArray.slice(i, i + itemsPerCol) });
    }

    return cols;
  }

  $handleStateHover(index, stateName = null) {
    if (stateName) {
      this._setState(stateName);
      return;
    }
    this._setState(states[index]);
  }

  set props(props) {
    this._props = { ...this._props, ...props };

    // const cmpTitle = CMPService.cmpData?.title;
    // const cmpDescription = CMPService.cmpData?.description;

    const languages = this._props.languagesData;
    const cols = this._arrangeLngBtns(languages);

    this._LanguagesRowContainer.props = {
      parentState: 'Languages',
      items: cols.map((col) => ({
        type: VerticalContainer,
        collision: true,
        h: 500,
        w: 300,
        flexItem: {
          marginRight: 20,
        },
        props: {
          parentState: 'Languages',
          disableScroll: true,
          items: col.items.map((item, index) => ({
            type: LanguageButton,
            collision: true,
            props: {
              languageInfo: item.value,
              languageIndex: index,
              languageCode: item.key,
            },
            w: 300,
            h: 65,
          })),
        },
      })),
    };

    this._Content.patch({
      CMPContainer: {
        collision: true,
        CMPData: {
          collision: true,
          flex: { direction: 'column' },
          w: 1210,
          h: 920,
          // Title: {
          //   w: 1000,
          //   h: 50,
          //   text: {
          //     text: cmpTitle,
          //     fontSize: 40,
          //     fontFace: 'Montserrat-Bold',
          //     lineHeight: 50,
          //     textAlign: 'left',
          //   },
          // },
          // Description: {
          //   w: 1200,
          //   h: 100,
          //   y: 30,
          //   flexItem: {
          //     marginBottom: 20,
          //   },
          //   text: {
          //     text: cmpDescription,
          //     fontSize: 24,
          //     fontFace: 'Montserrat-Regular',
          //     lineHeight: 30,
          //     textAlign: 'left',
          //   },
          // },
          ConsentChangeButton: {
            type: Button,
            props: {
              width: 300,
              height: 95,
              buttonLabel: t(TRANSLATIONS.COOKIE_PREFERENCES),
              callback: async () => {
                await window.Didomi.notice.show();

                this.fireAncestors('$didomiVisible', true);
                this.fireAncestors('$settingsDidomi', true);
              },
            },
          },
        },
      },
    });
  }

  _active() {
    this._setState('Languages');
  }

  _handleBack() {
    if (window.Didomi && didomiVisible) {
      return true;
    }

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
      class Languages extends this {
        _getFocused() {
          return this._LanguagesRowContainer;
        }

        _handleUp() {
          if (window.Didomi && didomiVisible) {
            return true;
          }

          if (!Router.isNavigating()) {
            Router.focusWidget(ROUTES.MENU_WIDGET);
          }
        }

        _handleDown() {
          this._setState('CMP');
        }
      },

      class CMP extends this {
        _getFocused() {
          return this.tag('ConsentChangeButton');
        }

        _handleUp() {
          if (window.Didomi && didomiVisible) {
            return true;
          }

          this._setState('Languages');
        }
      },
    ];
  }
}

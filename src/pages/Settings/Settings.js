import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import LanguageButton from '../../components/Buttons/LanguageButton/LanguageButton';
import CMPButton from '../../components/Buttons/CMPButton/CMPButton';
import { CMPService } from '../../Services';
import { ROUTES, TRANSLATIONS, IMG_PATH } from '../../constants/globalConstants';
import { t } from '../../Services';

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
          Languages: {
            y: 50,
            x: 550,
            type: VerticalContainer,
            collision: true,
            w: 1050,
            h: 300,
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

  get _Languages() {
    return this.tag('Content.LanguagesContainer.Languages');
  }

  get _Content() {
    return this.tag('Content');
  }

  get _CMPData() {
    return this.tag('Content.CMPContainer.CMPData');
  }

  get CMPButtons() {
    return this.tag('Content.CMPContainer.CMPData.Buttons');
  }

  set props(props) {
    this._props = { ...this._props, ...props };

    const buttonsResult = CMPService.cmpData?.buttons;
    const cmpTitle = CMPService.cmpData?.title;
    const cmpDescription = CMPService.cmpData?.description;

    const buttons = Object.values(buttonsResult).map((value, btnIndex) => {
      return {
        type: CMPButton,
        collision: true,
        flexItem: {
          marginBottom: 18,
        },
        props: {
          label: value.label,
          callback: async () => {
            if (value.callback_url) {
              const chosenValue = btnIndex === 0 ? 1 : 0;
              await CMPService.selectCMPChoice(this._props.serialNumber, chosenValue);
              Router.navigate(ROUTES.HOME);
            } else {
              Router.navigate(ROUTES.CMP_CUSTOMIZE, { options: value.options });
            }
          },
        },
      };
    });

    const { languages } = this._props.languagesData;
    const languagesArr = languages.split(',');
    const languageItems = languagesArr.map((language, index) => ({
      type: LanguageButton,
      props: {
        languageInfo: language,
        languageIndex: index,
      },
      w: 300,
      h: 65,
    }));

    this._Content.patch({
      LanguagesContainer: {
        Languages: {
          zIndex: 3,
          type: VerticalContainer,
          collision: true,
          w: 1050,
          h: 300,
          props: {
            items: languageItems,
            enableScroll: false,
            w: 1050,
            h: 300,
            parentState: 'Languages',
          },
        },
      },
      CMPContainer: {
        collision: true,
        CMPData: {
          collision: true,
          flex: { direction: 'column' },
          w: 1210,
          h: 920,
          Title: {
            w: 1000,
            h: 50,
            text: {
              text: cmpTitle,
              fontSize: 40,
              fontFace: 'Montserrat-Bold',
              lineHeight: 50,
              textAlign: 'left',
            },
          },
          Description: {
            w: 1200,
            h: 100,
            y: 30,
            flexItem: {
              marginBottom: 20,
            },
            text: {
              text: cmpDescription,
              fontSize: 24,
              fontFace: 'Montserrat-Regular',
              lineHeight: 30,
              textAlign: 'left',
            },
          },
          Buttons: {
            w: 1050,
            h: 400,
            y: 20,
            type: VerticalContainer,
            collision: true,
            props: {
              items: buttons,
              parentState: 'CMPContainer',
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
      class CMPContainer extends this {
        _getFocused() {
          return this.CMPButtons;
        }

        _handleUp() {
          this._setState('Languages');
        }
      },

      class Languages extends this {
        _getFocused() {
          return this._Languages;
        }

        _handleUp() {
          if (!Router.isNavigating()) {
            Router.focusWidget(ROUTES.MENU_WIDGET);
          }
        }

        _handleDown() {
          this._setState('CMPContainer');
        }
      },
    ];
  }
}

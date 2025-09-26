import { Colors, Lightning, Router } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import LanguageButton from '../../components/Buttons/LanguageButton/LanguageButton';
import { CMPService } from '../../Services';
import Button from '../../components/Button/Button';
import { getDeviceInfo } from '../../utils/device';

export default class LanguageSettings extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        color: Colors(colors.background).get(),
        rect: true,
      },
      Wrapper: {
        x: 110,
        y: 225,
        h: 300,
        w: 1720,
        Column: {
          h: 300,
          w: 1720,
          collision: true,
          type: VerticalContainer,
        },
      },
      Content: {
        w: 1310,
        h: 920,
        x: 480,
        y: 225,
        CMPContainer: {
          w: 1310,
          h: 920,
          Buttons: {
            w: 1050,
            h: 400,
            y: 100,
            collision: true,
            type: VerticalContainer,
          },
        },
      },
      Version: {
        x: 100,
        y: 980,
        w: 230,
        h: 100,
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

  get _Column() {
    return this.tag('Column');
  }

  get _Languages() {
    return this.tag('Content.Languages');
  }

  get _Content() {
    return this.tag('Content');
  }

  get _CMPContainer() {
    return this.tag('Content.CMPContainer');
  }

  get CMPButtons() {
    return this.tag('Content.CMPContainer.Buttons');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
  }

  $setFocus(id) {
    const { lastId } = this._props;

    if (typeof lastId !== 'undefined') {
      // Unselect the button of the last ID before setting a new one
      this._Column.Items.children[lastId]._unselectButton();
    }
    // Set the new ID
    if (!id) {
      this._Column.Items.children[0]._selectButton();
      this._Column._focusedIndex = 0;
    } else {
      this._Column.Items.children[id]._selectButton();
      this._Column._focusedIndex = id;
    }
    // Update the lastId variable with the current ID
    this._props.lastId = id;
  }

  $setFocusLanguage(id) {
    const { lastLanguage } = this._props;

    if (typeof lastLanguage !== 'undefined') {
      // Unselect the button of the last ID before setting a new one
      this._Languages.Items.children[lastLanguage]._unselectButton();
    }
    // Set the new ID
    if (!id) {
      this._Languages.Items.children[0]._selectButton();
    } else {
      this._Languages.Items.children[id]._selectButton();
    }
    // Update the lastId variable with the current ID
    this._props.lastLanguage = id;
  }

  async $changeContent(contentId) {
    this._Content.patch({
      CMPContainer: undefined,
      Languages: undefined,
    });
    if (contentId === 0) {
      await CMPService.initialFetch();
      const serialNumber = getDeviceInfo().serialNumber;

      const buttonsResult = CMPService.cmpData?.buttons;
      const cmpTitle = CMPService.cmpData?.title;
      const cmpDescription = CMPService.cmpData?.description;

      const buttons = Object.values(buttonsResult).map((value, btnIndex) => {
        return {
          type: Button,
          collision: true,
          w: 1050,
          flexItem: {
            marginBottom: 18,
          },
          props: {
            width: 1050,
            height: 72,
            buttonLabel: value.label,
            buttonIcon: '',
            strokeWidth: 1.5,
            borderColor: '#696969',
            callback: async () => {
              if (value.callback_url) {
                const chosenValue = btnIndex === 0 ? 1 : 0;
                await CMPService.selectCMPChoice(serialNumber, chosenValue);
                await Router.navigate('home');
              } else {
                Router.navigate('cmp-customize', { options: value.options });
              }
            },
          },
        };
      });

      this._Content.patch({
        CMPContainer: {
          flex: { direction: 'column', alignItems: 'center' },
          w: 1310,
          h: 920,
          Title: {
            w: 1000,
            h: 50,
            text: {
              text: cmpTitle,
              fontSize: 40,
              fontFace: 'Montserrat-Bold',
              lineHeight: 50,
              textAlign: 'center',
            },
          },
          Description: {
            w: 1000,
            h: 100,
            y: 30,
            text: {
              text: cmpDescription,
              fontSize: 24,
              fontFace: 'Montserrat-Regular',
              lineHeight: 30,
              textAlign: 'center',
            },
          },
          Buttons: {
            w: 1050,
            h: 400,
            y: 100,
            type: VerticalContainer,
            collision: true,
            props: {
              items: buttons,
            },
          },
        },
      });
    } else if (contentId === 1) {
      const { languages } = this._props.languagesData;
      const languagesArr = languages.split(',');

      const items = languagesArr.map((language, index) => ({
        type: LanguageButton,
        props: {
          languageInfo: language,
          languageIndex: index,
        },
        w: 1050,
        h: 100,
      }));

      this._Content.patch({
        Languages: {
          type: VerticalContainer,
          collision: true,
          w: 1050,
          h: 300,
          props: {
            items: items,
            enableScroll: false,
            w: 1050,
            h: 300,
          },
        },
      });
    }
  }

  $setStateOnHover(nextState) {
    this._setState(nextState);
  }

  _active() {
    this._setState('DefaultState');
    this.$changeContent(0);
  }

  static _states() {
    return [
      class DefaultState extends this {
        _getFocused() {
          return this._Column;
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleRight() {
          if (this._CMPContainer) {
            this._setState('CMPContainer');
          }
          if (this._Languages) {
            this._setState('Languages');
          }
        }
      },

      class CMPContainer extends this {
        _getFocused() {
          return this.CMPButtons;
        }

        _handleLeft() {
          this._setState('DefaultState');
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }
      },

      class Languages extends this {
        _getFocused() {
          return this._Languages;
        }

        _handleUp() {
          this._setState('DefaultState');
        }

        _handleLeft() {
          this._setState('DefaultState');
        }
      },
    ];
  }
}
